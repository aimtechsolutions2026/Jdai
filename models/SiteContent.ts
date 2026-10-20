import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPartnerCompany {
  name: string;
  iconKey: string;
  logoUrl?: string;
  websiteUrl?: string;
  enabled: boolean;
}

export interface IFeatureItem {
  title: string;
  description: string;
  iconKey: string;
  badge?: string;
}

export interface IStepItem {
  stepNumber: number;
  title: string;
  description: string;
}

export interface IFaqItem {
  q: string;
  a: string;
}

export interface ISiteContent extends Document {
  key: string;
  partners: {
    heading: string;
    badge: string;
    companies: IPartnerCompany[];
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    primaryCtaLink: string;
    secondaryCtaText: string;
    secondaryCtaLink: string;
    featureBadges: string[];
  };
  features: {
    heading: string;
    subheading: string;
    description: string;
    items: IFeatureItem[];
  };
  howItWorks: {
    heading: string;
    subheading: string;
    seekerSteps: IStepItem[];
    recruiterSteps: IStepItem[];
  };
  faqs: {
    heading: string;
    subheading: string;
    items: IFaqItem[];
  };
  ctaBanner: {
    heading: string;
    subheading: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  footer: {
    description: string;
    supportEmail: string;
    socialLinks: {
      github?: string;
      linkedin?: string;
      twitter?: string;
      discord?: string;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>(
  {
    key: { type: String, required: true, unique: true, default: "landing" },
    partners: {
      heading: { type: String, default: "" },
      badge: { type: String, default: "" },
      companies: [
        {
          name: { type: String, required: true },
          iconKey: { type: String, default: "" },
          logoUrl: { type: String, default: "" },
          websiteUrl: { type: String, default: "" },
          enabled: { type: Boolean, default: true },
        },
      ],
    },
    hero: {
      badge: { type: String, default: "" },
      title: { type: String, default: "" },
      subtitle: { type: String, default: "" },
      primaryCtaText: { type: String, default: "" },
      primaryCtaLink: { type: String, default: "" },
      secondaryCtaText: { type: String, default: "" },
      secondaryCtaLink: { type: String, default: "" },
      featureBadges: [{ type: String }],
    },
    features: {
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      description: { type: String, default: "" },
      items: [
        {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          iconKey: { type: String, default: "" },
          badge: { type: String, default: "" },
        },
      ],
    },
    howItWorks: {
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      seekerSteps: [
        {
          stepNumber: { type: Number, default: 1 },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      recruiterSteps: [
        {
          stepNumber: { type: Number, default: 1 },
          title: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
    },
    faqs: {
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      items: [
        {
          q: { type: String, default: "" },
          a: { type: String, default: "" },
        },
      ],
    },
    ctaBanner: {
      heading: { type: String, default: "" },
      subheading: { type: String, default: "" },
      primaryButtonText: { type: String, default: "" },
      primaryButtonLink: { type: String, default: "" },
      secondaryButtonText: { type: String, default: "" },
      secondaryButtonLink: { type: String, default: "" },
    },
    footer: {
      description: { type: String, default: "" },
      supportEmail: { type: String, default: "" },
      socialLinks: {
        github: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        twitter: { type: String, default: "" },
        discord: { type: String, default: "" },
      },
    },
  },
  {
    timestamps: true,
  }
);

export const SiteContent: Model<ISiteContent> =
  mongoose.models.SiteContent ||
  mongoose.model<ISiteContent>("SiteContent", SiteContentSchema);
