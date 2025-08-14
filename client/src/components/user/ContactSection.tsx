import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { contactService } from '@/API/services/contactService';

interface Contact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    courseDescription: string;
    status: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

interface ContactSectionProps {
    settings: any;
}

interface ContactFormData {
    name: string;
    email: string;
    phone: string;
    courseDescription: string;
}

export const ContactSection = ({ settings }: ContactSectionProps) => {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        courseDescription: ''
    });
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                console.log('Attempting to fetch contacts...');
                const response = await contactService.getAllContacts();
                
                if (response?.data?.contacts) {
                    console.log('Setting contacts:', response.data.contacts);
                    setContacts(response.data.contacts);
                } else {
                    console.log('No contacts data in response:', response);
                    toast.error('No contacts data found');
                }
            } catch (error: any) {
                console.error('Error fetching contacts:', error);
                console.error('Error response:', error.response?.data);
                toast.error(error.response?.data?.message || 'Failed to load contacts');
            } finally {
                setIsLoading(false);
            }
        };

        // Check if we have authentication token
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (!token) {
            console.log('No authentication token found');
            setIsLoading(false);
            return;
        }

        fetchContacts();
    }, []);

    const handleInputChange = (field: keyof ContactFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            setIsSubmitting(true);
            await contactService.submitContactForm(formData);
            
            toast.success('Thank you for your interest! We will contact you soon.');
            
            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                courseDescription: ''
            });
        } catch (error) {
            console.error('Error submitting contact form:', error);
            toast.error('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if contact section is enabled in settings
    const contactSettings = settings?.body?.contact;
    // Hide contact section if explicitly set to false
    if (contactSettings?.isVisible === false) {
        return null;
    }

    return (
        <section id="contact" className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: settings?.theme?.primaryColor || '#059669' }}>
                        {contactSettings?.title || 'Contact Us'}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {contactSettings?.description || 'Get in touch with us to learn more about our courses and start your educational journey today.'}
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-6" style={{ color: settings?.theme?.primaryColor || '#059669' }}>
                                Get In Touch
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Ready to start your learning journey? Contact us today and our team will help you choose the perfect course for your career goals.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {settings?.footer?.contact?.address && (
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${settings?.theme?.primaryColor || '#059669'}20` }}>
                                        <MapPin size={20} style={{ color: settings?.theme?.primaryColor || '#059669' }} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Address</h4>
                                        <p className="text-gray-600">{settings.footer.contact.address}</p>
                                    </div>
                                </div>
                            )}

                            {settings?.footer?.contact?.phone && (
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${settings?.theme?.primaryColor || '#059669'}20` }}>
                                        <Phone size={20} style={{ color: settings?.theme?.primaryColor || '#059669' }} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Phone</h4>
                                        <p className="text-gray-600">{settings.footer.contact.phone}</p>
                                    </div>
                                </div>
                            )}

                            {settings?.footer?.contact?.email && (
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${settings?.theme?.primaryColor || '#059669'}20` }}>
                                        <Mail size={20} style={{ color: settings?.theme?.primaryColor || '#059669' }} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Email</h4>
                                        <p className="text-gray-600">{settings.footer.contact.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form - Only show if admin enables it */}
                    {contactSettings?.showForm !== false && (
                        <Card className="shadow-lg border-0">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold" style={{ color: settings?.theme?.primaryColor || '#059669' }}>
                                    Send us a Message
                                </CardTitle>
                                <p className="text-gray-600">
                                    Fill out the form below and we'll get back to you as soon as possible.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="Enter your email"
                                                value={formData.email}
                                                onChange={(e) => handleInputChange('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="courseDescription">Course Interest</Label>
                                        <Textarea
                                            id="courseDescription"
                                            placeholder="Tell us which course you're interested in or any specific questions you have..."
                                            value={formData.courseDescription}
                                            onChange={(e) => handleInputChange('courseDescription', e.target.value)}
                                            rows={4}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={isSubmitting}
                                        style={{ backgroundColor: settings?.theme?.primaryColor || '#059669' }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="mr-2 h-4 w-4" />
                                                Send Message
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Contacts List */}
                <div className="mt-16">
                    <h3 className="text-2xl font-semibold mb-6" style={{ color: settings?.theme?.primaryColor || '#059669' }}>
                        Recent Contacts
                    </h3>
                    {isLoading ? (
                        <div className="flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        </div>
                    ) : contacts.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contacts.map((contact) => (
                                <Card key={contact._id} className="shadow-sm">
                                    <CardContent className="p-6">
                                        <h4 className="font-semibold text-lg mb-2">{contact.name}</h4>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <p className="flex items-center">
                                                <Mail className="w-4 h-4 mr-2" />
                                                {contact.email}
                                            </p>
                                            <p className="flex items-center">
                                                <Phone className="w-4 h-4 mr-2" />
                                                {contact.phone}
                                            </p>
                                            {contact.courseDescription && (
                                                <p className="mt-3 pt-3 border-t">
                                                    <span className="font-medium">Course Interest:</span>
                                                    <br />
                                                    {contact.courseDescription}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500 mt-2">
                                                Status: <span className="capitalize">{contact.status}</span>
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center">No contacts found.</p>
                    )}
                </div>
            </div>
        </section>
    );
};
