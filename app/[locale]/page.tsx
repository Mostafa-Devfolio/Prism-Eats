import HomeMenu from "./(Components)/HomeMenu/HomeMenu";
import { getHomeProducts } from "./actions";

export default async function HomePage() {
  const { products, hasMore } = await getHomeProducts(1, 8);

  return (
    <div className="min-h-screen bg-[#FBF6EE]">
      {/* Welcome Section */}
      <div className="bg-[#1A1310] px-6 py-16 text-center sm:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          PRISM <span className="text-[#D64C1E]">Eats</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-[#A89A87]">
          Delicious food, delivered fast. Experience the best fast-food
          ecosystem.
        </p>
      </div>

      {/* Products Section*/}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-[#1A1310]">Our Menu</h2>
        </div>

        <HomeMenu initialProducts={products} initialHasMore={hasMore} />
      </div>
    </div>
  );
}
