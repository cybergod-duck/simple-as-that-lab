import { MetadataRoute } from 'next';
import { getIndustryData } from '../utils/csvParser';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://simple-as-that.org';
    const industries = getIndustryData();

    const dynamicRoutes = industries.map((ind) => ({
        url: `${baseUrl}/website-creation-for-${ind.slug.replace('website-creation-for-', '')}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 1,
        },
        {
            url: `${baseUrl}/onboarding`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...dynamicRoutes,
    ];
}
