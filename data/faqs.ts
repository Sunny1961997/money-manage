import type { LucideIcon } from "lucide-react";
import {
  BadgeHelp,
  BookOpenCheck,
  Building2,
  FileCheck2,
  Fingerprint,
  Gavel,
  Landmark,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

export interface FAQItem {
  id: string;
  question: string;
  label: string;
  answer: string;
  icon: LucideIcon;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-what-is",
    question: "What is AML Meter?",
    label: "Platform Overview",
    icon: BadgeHelp,
    answer:
      "AML Meter is a compliance technology platform designed to assist Designated Non-Financial Businesses and Professions (DNFBPs) and other regulated entities in fulfilling their responsibilities under the UAE Anti-Money Laundering (AML) and Counter-Terrorist Financing (CFT) framework. It offers a structured environment for customer due diligence (CDD), risk assessment, screening, and documentation, in accordance with a risk-based compliance approach.",
  },
  {
    id: "faq-support",
    question: "How does AML Meter support AML and CFT compliance?",
    label: "Compliance Support",
    icon: ShieldCheck,
    answer:
      "AML Meter enforces essential AML/CFT controls. It helps with client identification and verification, sanctions and PEP screening, customer risk rating, and moving to Enhanced Due Diligence (EDD) when risks are high. The platform ensures compliance measures are reasonable, well-documented, and aligned with the ML/TF risk the company faces.",
  },
  {
    id: "faq-data",
    question: "What information is captured and assessed in AML Meter?",
    label: "CDD Data Capture",
    icon: Fingerprint,
    answer:
      "Core CDD information, such as customer identification details, beneficial ownership structures, the nature and purpose of the business relationship, source-of-funds and source-of-wealth indicators, and relevant risk factors associated with customer type, products and services, geography, and delivery channels, is captured and assessed by AML Meter. This data is used to establish a documented customer risk profile that aligns with the requirements of UAE AML regulations.",
  },
  {
    id: "faq-sectors",
    question: "Which DNFBP sectors can use AML Meter?",
    label: "Eligible Sectors",
    icon: Building2,
    answer:
      "AML Meter is built for UAE-regulated DNFBPs, including real estate brokers and agents, dealers in precious metals and stones (DPMS), corporate and trust service providers, accounting and audit firms, legal and professional service providers, and other non-financial businesses subject to AML/CFT supervision.",
  },
  {
    id: "faq-onboarding",
    question: "Is AML Meter suitable for customer onboarding?",
    label: "Onboarding",
    icon: UserCheck,
    answer:
      "AML Meter facilitates compliant customer registration by integrating CDD, screening, and risk assessment into a unified, controlled workflow. This helps ensure that business relationships are established only after the completion, review, and recording of appropriate due diligence measures.",
  },
  {
    id: "faq-edd",
    question: "How does AML Meter support Enhanced Due Diligence (EDD)?",
    label: "Enhanced Due Diligence",
    icon: BookOpenCheck,
    answer:
      "For clients who pose a greater risk, AML Meter enables improved documentation, more thorough risk analysis, and increased data collection. This includes the ability to record additional wealth and funding sources, enhanced screening outcomes, and management review processes, which help facilitate regulatory compliance in high ML/TF risk situations.",
  },
  {
    id: "faq-review",
    question: "How often are customer profiles reviewed in AML Meter?",
    label: "Ongoing Review",
    icon: FileCheck2,
    answer:
      "AML Meter facilitates continuous monitoring and periodic evaluations based on customer risk classification. Either predetermined intervals (for example, low-, medium-, or high-risk cycles) or significant changes (updated risk indicators, shifts in transactional behavior, incorrect information, or regulatory updates) can trigger the scheduling of reviews.",
  },
  {
    id: "faq-automation",
    question: "Does AML Meter support automation and batch processing?",
    label: "Automation",
    icon: Users,
    answer:
      "AML Meter combines standardized risk-assessment logic, automated workflows, and bulk screening capabilities, while maintaining appropriate human oversight and governance controls. This enables DNFBPs to manage compliance obligations effectively without compromising the efficacy of control.",
  },
  {
    id: "faq-audit",
    question: "How does AML Meter support record-keeping and audit trails?",
    label: "Audit Trails",
    icon: Landmark,
    answer:
      "AML Meter keeps full, time-stamped records of all CDD data, screening results, risk assessments, review choices, and ongoing monitoring activities. In line with UAE AML record-keeping rules, these well-organized audit trails support external audits, regulatory checks, and internal compliance management.",
  },
  {
    id: "faq-uae",
    question: "Is AML Meter aligned with UAE AML regulatory requirements?",
    label: "Regulatory Alignment",
    icon: Gavel,
    answer:
      "For DNFBPs in the United Arab Emirates, AML Meter is designed to comply with relevant supervisory guidelines, implementing rules, and AML/CFT laws. The UAE has adopted both national regulatory requirements and foreign standards, and this platform enables the development of a written, risk-based strategy.",
  },
];
