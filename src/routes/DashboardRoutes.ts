import { DashboardMenuProps } from "types";
import { v4 as uuid } from "uuid";

export const DashboardMenu: DashboardMenuProps[] = [
  {
    id: uuid(),
    title: "Dashboard",
    icon: "home",
    link: "/",
  },
    {
    id: uuid(),
    title: "Vehicles Management",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Vehicles",
    icon: "truck",
    children: [
      { id: uuid(), link: "/vehicles/listing", name: "Vehicles Listing" },
      { id: uuid(), link: "/vehicles/brands", name: "Brand Listing" },
      { id: uuid(), link: "/vehicles/models", name: "Model Listing" },
      { id: uuid(), link: "/vehicles/documents", name: "Documents Listing" },
      { id: uuid(), link: "/vehicles/document-types", name: "Document Types Listing" },
    ],
  },
  {
    id: uuid(),
    title: "Insurance",
    icon: "shield",
    children: [
      { id: uuid(), link: "/insurance/details", name: "Insurance Details" },
      { id: uuid(), link: "/insurance/companies", name: "Insurance Companies" },
      { id: uuid(), link: "/insurance/periods", name: "Insurance Periods" },
    ],
  },
   {
    id: uuid(),
    title: "Installment",
    icon: "credit-card",
    children: [
      { id: uuid(), link: "/installment/listing", name: "Installment Listing" },
      { id: uuid(), link: "/installment/historiques", name: "Installment Historiques" },
      { id: uuid(), link: "/installment/companies", name: "Installment Companies" },
    ],
  },
  {
    id: uuid(),
    title: "Fuel & Mileage",
    icon: "droplet",
    children: [
      { id: uuid(), link: "/mileage/records", name: "Installment Listing" },
      { id: uuid(), link: "/fuel/logs", name: "Installment Historiques" },
    ],
  },
  {
    id: uuid(),
    title: "Maintenance",
    icon: "lock",
    children: [
      { id: uuid(), link: "/maintenances", name: "Service History" },
    ],
  },
   {
    id: uuid(),
    title: "Activity Management",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Vehicles Listing",
    icon: "truck",
    link: "/vehicles/listing",
  },
    {
    id: uuid(),
    title: "Drivers",
    icon: "users",
    link: "/drivers/listing",
  },
    {
    id: uuid(),
    title: "Activity",
    icon: "map",
    children: [
      { id: uuid(), link: "/activities/trip", name: "Trip Listing" },
      { id: uuid(), link: "/activities/transfer", name: "Transfer Listing" },

    ],
  },
  {
    id: uuid(),
    title: "Mission",
    icon: "list",
    children: [
      { id: uuid(), link: "/missions/trip", name: "Mission Trip Listing" },
      { id: uuid(), link: "/missions/transfer", name: "Mission Transfer Listing" },

    ],
  },
 
  {
    id: uuid(),
    title: "Documentation",
    grouptitle: true,
  },
  {
    id: uuid(),
    title: "Docs",
    icon: "clipboard",
    link: "/documentation",
  },
 
];
