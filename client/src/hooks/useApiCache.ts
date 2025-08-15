import * as reactQuery from '@tanstack/react-query';
import { settingsService, type BranchSettings } from '../API/services/settingsService';
import { publicService, type PublicStatistics } from '../API/services/publicService';
import { contactService } from '../API/services/contactService';

// Define types for our cache hooks
type UseSettingsReturn = {
    data: BranchSettings | undefined;
    isLoading: boolean;
    error: unknown;
};

type UseStatisticsReturn = {
    data: PublicStatistics | undefined;
    isLoading: boolean;
    error: unknown;
};

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    courseDescription: string;
}

export const useApiCache = () => {
    const queryClient = reactQuery.useQueryClient();

    // Settings Cache Hook
    const useSettings = (): UseSettingsReturn => {
        const { data, isLoading, error } = reactQuery.useQuery<BranchSettings, Error>({
            queryKey: ['settings'],
            queryFn: () => settingsService.getPublicSettings(),
            staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
            gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
            retry: 1,
            refetchOnWindowFocus: false,
        });

        return { data, isLoading, error };
    };

    // Statistics Cache Hook
    const useStatistics = (): UseStatisticsReturn => {
        const { data, isLoading, error } = reactQuery.useQuery<PublicStatistics, Error>({
            queryKey: ['statistics'],
            queryFn: () => publicService.getPublicStatistics(),
            staleTime: 5 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            retry: 1,
            refetchOnWindowFocus: false,
        });

        return { data, isLoading, error };
    };

    // Contact Form Submission with Cache Invalidation
    const useSubmitContact = () => {
        return reactQuery.useMutation({
            mutationFn: (formData: ContactFormData) => contactService.submitContactForm(formData),
            onSuccess: () => {
                // Show success message or handle success case
                console.log('Form submitted successfully');
                // Invalidate contacts cache after successful submission
                queryClient.invalidateQueries({ queryKey: ['contacts'] });
            },
            onError: (error: Error) => {
                // Handle error case
                console.error('Error submitting form:', error);
            }
        });
    };

    // Force Refresh Function
    const forceRefresh = async (queryKey: string[]) => {
        try {
            await queryClient.invalidateQueries({ queryKey });
            console.log(`Cache invalidated for ${queryKey.join('.')}`);
        } catch (error) {
            console.error(`Error refreshing cache for ${queryKey.join('.')}:`, error);
        }
    };

    return {
        useSettings,
        useStatistics,
        useSubmitContact,
        forceRefresh
    };
};
