import os
import json
import requests
import pandas as pd
from google.oauth2 import service_account
import google.auth.transport.requests

# Configuration
# Make sure your service_account.json is in the same directory as this script.
SERVICE_ACCOUNT_FILE = os.path.join(os.path.dirname(__file__), 'service_account.json')
CSV_FILE_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'the-index', 'data_dir', 'data.csv')
SITE_URL = "https://simple-as-that.org" # Update if deployed elsewhere
BATCH_SIZE = 100 # Google API allows up to 100 in a batch

# API URL
ENDPOINT = "https://indexing.googleapis.com/v3/urlNotifications:publish"

def get_access_token():
    """Generates the OAuth 2.0 access token using the Service Account JSON."""
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        print(f"[-] ERROR: Service account file not found at {SERVICE_ACCOUNT_FILE}")
        print("[!] Please complete Phase 1 of the GOOGLE_INDEXING_API_GUIDE.md and place the JSON file here.")
        return None

    scopes = ["https://www.googleapis.com/auth/indexing"]
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=scopes
    )
    
    request = google.auth.transport.requests.Request()
    credentials.refresh(request)
    
    return credentials.token

def get_urls_from_csv():
    """Reads data.csv and formats the 1800+ dynamic routing URLs."""
    if not os.path.exists(CSV_FILE_PATH):
        print(f"[-] ERROR: data.csv not found at {CSV_FILE_PATH}")
        return []
        
    try:
        df = pd.read_csv(CSV_FILE_PATH)
        # Next.js app router uses /website-creation-for-[industry] slugs now
        urls = []
        for slug in df['slug'].dropna():
            urls.append(f"{SITE_URL}/{slug}")
        return urls
    except Exception as e:
        print(f"[-] Error reading CSV: {e}")
        return []

def publish_url(url, access_token, notification_type="URL_UPDATED"):
    """Publishes a single URL. We will use batching for the actual payload."""
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "url": url,
        "type": notification_type
    }
    
    response = requests.post(ENDPOINT, headers=headers, json=payload)
    if response.status_code == 200:
        return True
    else:
        print(f"[-] Failed to push {url}: {response.status_code} - {response.text}")
        return False

def bulk_publish(urls, access_token):
    """
    Submits URLs in an HTTP Batch Request format.
    The Indxing API has a default quota of 200 requests per day per project.
    We will process them in batches of 100 to maximize throughput.
    """
    print(f"[*] Preparing to index {len(urls)} URLs. Please note your Google Cloud Quotas (default is 200/day).")
    
    # We will just do standard iteration here since batch HTTP parsing for Google can be complex without the specific google-api-python-client.
    # The direct REST API is usually sufficient for < 200/day limits.
    
    success_count = 0
    fail_count = 0
    
    for i, url in enumerate(urls):
        # Stop if we hit typical default daily quotas to avoid spam-banning our bot
        if i >= 200:
            print("[!] Pausing execution. Default Google Cloud Indexing API Quota is 200 URLs per day.")
            print("[!] Request a quota increase in Google Cloud Console to index the remaining 1,600+ URLs immediately.")
            break
            
        print(f"[*] Submitting ({i+1}): {url}")
        success = publish_url(url, access_token)
        if success:
            success_count += 1
        else:
            fail_count += 1
            if fail_count > 5:
                print("[-] Detected multiple failures. Exiting to prevent API lockout. Please check your Search Console Permissions.")
                break
                
    print(f"\n[+] Execution Complete. Successfully pinged Google Indexing API for {success_count} URLs.")

if __name__ == "__main__":
    print("[+] Initializing Simple-As-That Bulk Indexer...")
    
    token = get_access_token()
    if not token:
        exit(1)
        
    print("[+] OAuth Token Acquired. Scanning data.csv for routes...")
    all_urls = get_urls_from_csv()
    
    if not all_urls:
         print("[-] No URLs extracted. Aborting.")
         exit(1)
         
    # Optional: also append the absolute root domain and core static pages
    all_urls.insert(0, SITE_URL)
    all_urls.insert(1, f"{SITE_URL}/checkout")
    
    bulk_publish(all_urls, token)
