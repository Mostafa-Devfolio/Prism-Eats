import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  const products = [
    {
      nameEn: "Classic Cheeseburger",
      nameAr: "برجر كلاسيك بالجبن",
      description:
        "Juicy beef patty with melted cheddar, lettuce, tomato, and special sauce.",
      price: 8.99,
      imageUrl:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
    },
    {
      nameEn: "Double Bacon Burger",
      nameAr: "برجر مزدوج باللحم المقدد",
      description:
        "Two beef patties stacked with crispy bacon and smoked gouda.",
      price: 11.49,
      imageUrl:
        "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80",
    },
    {
      nameEn: "Margherita Pizza",
      nameAr: "بيتزا مارجريتا",
      description:
        "Classic pizza with fresh mozzarella, basil, and tomato sauce.",
      price: 12.99,
      imageUrl:
        "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80",
    },
    {
      nameEn: "Pepperoni Pizza",
      nameAr: "بيتزا بالبيبروني",
      description:
        "Loaded with spicy pepperoni and a generous layer of mozzarella cheese.",
      price: 13.99,
      imageUrl:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&q=80",
    },
    {
      nameEn: "Crispy French Fries",
      nameAr: "بطاطس مقلية مقرمشة",
      description: "Golden crispy fries seasoned with sea salt.",
      price: 3.99,
      imageUrl:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&q=80",
    },
    {
      nameEn: "Spicy Chicken Wings",
      nameAr: "أجنحة دجاج حارة",
      description:
        "Crispy fried chicken wings tossed in a spicy buffalo sauce.",
      price: 9.49,
      imageUrl:
        "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=800&q=80",
    },
    {
      nameEn: "Grilled Chicken Sandwich",
      nameAr: "ساندويتش دجاج مشوي",
      description:
        "Tender grilled chicken breast with lettuce, mayo, and a toasted bun.",
      price: 7.99,
      imageUrl:
        "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80",
    },
    {
      nameEn: "Chocolate Milkshake",
      nameAr: "ميلك شيك بالشوكولاتة",
      description:
        "Rich and creamy chocolate milkshake topped with whipped cream.",
      price: 4.99,
      imageUrl:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80",
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("Seed data created successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
