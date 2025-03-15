export interface ColorPalette {
  primary_color: string;
  secondary_color: string;
  color_3: string;
  featured_image: string;
}

export interface SocialLinks {
  facebook: string;
  pinterest: string;
  instagram: string;
  medium: string;
}

export interface ContactInfos {
  subtitle: string;
  paragraph1: string;
  paragraph2: string;
  paragraph3: string;
  paragraph4: string;
  email: string;
  phone: string;
  address: string;
}

export interface AboutInfos {
  title: string;
  subtitle: string;
  content: string;
}

export interface Product {
  slug: any;
  id: number;
  title: string;
  content: string;
  excerpt: string;
  meta: {
      price: string;
      rating: number;
      featured_image: string;
  };
}
