import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const roles = [
  {
    name: "Administrator",
    slug: "admin",
    description: "Full system access with all administrative privileges",
  },
  {
    name: "Veterinarian",
    slug: "veterinarian",
    description: "Veterinary doctor with access to medical records and appointments",
  },
  {
    name: "Staff",
    slug: "staff",
    description: "Front desk staff with access to appointments and POS",
  },
  {
    name: "Pet Owner",
    slug: "pet_owner",
    description: "Pet owner with access to their pets and appointments",
  },
];

const users = [
  {
    name: "System Administrator",
    email: "admin@copecares.com",
    password: "admin123",
    role: "admin",
    phone: null,
    address: null,
  },
  {
    name: "Dr. Juan Dela Cruz",
    email: "vet@copecares.com",
    password: "vet123",
    role: "veterinarian",
    phone: "09123456789",
    address: null,
  },
  {
    name: "Maria Santos",
    email: "staff@copecares.com",
    password: "staff123",
    role: "staff",
    phone: "09987654321",
    address: null,
  },
  {
    name: "John Smith",
    email: "owner@test.com",
    password: "owner123",
    role: "pet_owner",
    phone: "09111222333",
    address: "123 Main Street, City",
  },
];

const petCategories = [
  { name: "Dogs", description: "Canine pets" },
  { name: "Cats", description: "Feline pets" },
  { name: "Birds", description: "Avian pets" },
  { name: "Hamsters", description: "Small rodent pets" },
  { name: "Rabbits", description: "Rabbit pets" },
  { name: "Fish", description: "Aquatic pets" },
  { name: "Reptiles", description: "Reptile pets" },
  { name: "Others", description: "Other types of pets" },
];

const services = [
  {
    name: "General Check-up",
    description: "Complete physical examination and health assessment",
    price: 500,
    durationMinutes: 30,
    categories: ["Dogs", "Cats", "Birds", "Hamsters", "Rabbits"],
  },
  {
    name: "Vaccination",
    description: "Standard vaccination for common diseases",
    price: 800,
    durationMinutes: 20,
    categories: ["Dogs", "Cats"],
  },
  {
    name: "Anti-Rabies Vaccine",
    description: "Rabies vaccination for pets",
    price: 350,
    durationMinutes: 15,
    categories: ["Dogs", "Cats"],
  },
  {
    name: "Deworming",
    description: "Internal parasite treatment",
    price: 300,
    durationMinutes: 15,
    categories: ["Dogs", "Cats", "Rabbits"],
  },
  {
    name: "Grooming - Basic",
    description: "Bath, brush, nail trim, and ear cleaning",
    price: 500,
    durationMinutes: 60,
    categories: ["Dogs", "Cats"],
  },
  {
    name: "Grooming - Full",
    description: "Complete grooming with haircut and styling",
    price: 800,
    durationMinutes: 90,
    categories: ["Dogs", "Cats"],
  },
  {
    name: "Dental Cleaning",
    description: "Professional teeth cleaning and oral health check",
    price: 1500,
    durationMinutes: 45,
    categories: ["Dogs", "Cats"],
  },
  {
    name: "Spay/Neuter Surgery",
    description: "Sterilization surgery",
    price: 3500,
    durationMinutes: 120,
    categories: ["Dogs", "Cats", "Rabbits"],
  },
  {
    name: "X-Ray",
    description: "Diagnostic imaging",
    price: 1200,
    durationMinutes: 30,
    categories: ["Dogs", "Cats", "Birds", "Rabbits"],
  },
  {
    name: "Laboratory Tests",
    description: "Blood work and other laboratory diagnostics",
    price: 1000,
    durationMinutes: 20,
    categories: ["Dogs", "Cats", "Birds", "Hamsters", "Rabbits"],
  },
];

const productCategories = [
  { name: "Pet Food", description: "Dog and cat food products" },
  { name: "Medications", description: "Veterinary medicines and supplements" },
  { name: "Accessories", description: "Pet accessories and supplies" },
  {
    name: "Grooming Products",
    description: "Shampoos, brushes, and grooming tools",
  },
  { name: "Treats", description: "Pet treats and snacks" },
];

const products = [
  {
    category: "Pet Food",
    name: "Premium Dog Food 1kg",
    sku: "PDF-001",
    description: "High-quality dry dog food",
    costPrice: 250,
    sellingPrice: 350,
    stockQuantity: 50,
    reorderLevel: 10,
    unit: "pack",
  },
  {
    category: "Pet Food",
    name: "Cat Food Premium 1kg",
    sku: "PCF-001",
    description: "Nutritious cat food",
    costPrice: 280,
    sellingPrice: 380,
    stockQuantity: 45,
    reorderLevel: 10,
    unit: "pack",
  },
  {
    category: "Medications",
    name: "Deworming Tablet",
    sku: "MED-001",
    description: "Deworming medication for dogs and cats",
    costPrice: 50,
    sellingPrice: 100,
    stockQuantity: 100,
    reorderLevel: 20,
    unit: "tablet",
  },
  {
    category: "Medications",
    name: "Vitamin Supplement",
    sku: "MED-002",
    description: "Multi-vitamin for pets",
    costPrice: 150,
    sellingPrice: 250,
    stockQuantity: 60,
    reorderLevel: 15,
    unit: "bottle",
  },
  {
    category: "Accessories",
    name: "Dog Collar - Medium",
    sku: "ACC-001",
    description: "Adjustable dog collar",
    costPrice: 80,
    sellingPrice: 150,
    stockQuantity: 30,
    reorderLevel: 5,
    unit: "piece",
  },
  {
    category: "Grooming Products",
    name: "Pet Shampoo 500ml",
    sku: "GRM-001",
    description: "Gentle pet shampoo",
    costPrice: 120,
    sellingPrice: 200,
    stockQuantity: 40,
    reorderLevel: 10,
    unit: "bottle",
  },
  {
    category: "Treats",
    name: "Dog Treats Pack",
    sku: "TRT-001",
    description: "Delicious dog treats",
    costPrice: 60,
    sellingPrice: 120,
    stockQuantity: 80,
    reorderLevel: 15,
    unit: "pack",
  },
];

const settings = [
  {
    key: "clinic_name",
    value: "Tacloban City Veterinary Office",
    group: "general",
  },
  { key: "clinic_short_name", value: "TCVO", group: "general" },
  {
    key: "clinic_email",
    value: "copecares@tacloban.gov.ph",
    group: "general",
  },
  { key: "clinic_phone", value: "+63 912 093 2492", group: "general" },
  {
    key: "clinic_address",
    value:
      "2nd Floor, MASA Building, Tacloban City Supermarket, Tacloban City 6500",
    group: "general",
  },
  { key: "opening_time", value: "08:00", group: "schedule" },
  { key: "closing_time", value: "17:00", group: "schedule" },
  { key: "appointment_duration", value: "30", group: "schedule" },
  { key: "max_appointments_per_day", value: "30", group: "schedule" },
  { key: "tax_rate", value: "12", group: "pos" },
  { key: "currency_symbol", value: "₱", group: "pos" },
  {
    key: "receipt_footer",
    value: "Thank you for visiting the Tacloban City Veterinary Office!",
    group: "pos",
  },
];

async function main() {
  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: role,
      create: role,
    });
  }

  for (const user of users) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { slug: user.role },
    });

    const existing = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          name: user.name,
          phone: user.phone,
          address: user.address,
          roleId: role.id,
          isActive: true,
        },
      });
      continue;
    }

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: await hash(user.password, 10),
        phone: user.phone,
        address: user.address,
        roleId: role.id,
        isActive: true,
      },
    });
  }

  for (const category of petCategories) {
    const existing = await prisma.petCategory.findFirst({
      where: { name: category.name },
    });

    if (existing) {
      await prisma.petCategory.update({
        where: { id: existing.id },
        data: category,
      });
    } else {
      await prisma.petCategory.create({ data: category });
    }
  }

  for (const service of services) {
    const { categories, ...data } = service;
    const linkedCategories = await prisma.petCategory.findMany({
      where: { name: { in: categories } },
      select: { id: true },
    });

    const existing = await prisma.service.findFirst({
      where: { name: data.name },
    });

    if (existing) {
      await prisma.service.update({
        where: { id: existing.id },
        data: {
          ...data,
          petCategories: {
            set: linkedCategories.map((category) => ({ id: category.id })),
          },
        },
      });
    } else {
      await prisma.service.create({
        data: {
          ...data,
          petCategories: {
            connect: linkedCategories.map((category) => ({ id: category.id })),
          },
        },
      });
    }
  }

  for (const category of productCategories) {
    const existing = await prisma.productCategory.findFirst({
      where: { name: category.name },
    });

    if (existing) {
      await prisma.productCategory.update({
        where: { id: existing.id },
        data: category,
      });
    } else {
      await prisma.productCategory.create({ data: category });
    }
  }

  for (const product of products) {
    const { category, ...data } = product;
    const productCategory = await prisma.productCategory.findFirstOrThrow({
      where: { name: category },
    });

    await prisma.product.upsert({
      where: { sku: data.sku },
      update: { ...data, productCategoryId: productCategory.id },
      create: { ...data, productCategoryId: productCategory.id },
    });
  }

  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: setting,
      create: setting,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
