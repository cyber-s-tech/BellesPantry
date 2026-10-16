
import { useEffect, useState } from "react";
import { ArrowUpRightIcon, CaretLeftIcon, CaretRightIcon, ShoppingCartIcon } from "@phosphor-icons/react";

import { useCart } from "../../../../context/CartContext";


const API_URL =
  "https://soumi.ahaanmedia.com/wp-json/wc/store/v1/products?per_page=20";

const GAP = 30;

function formatPrice(product) {
  const prices = product.prices;

  if (!prices) return "";

  const minorUnit = Number(prices.currency_minor_unit ?? 2);
  const amount = Number(prices.price) / 10 ** minorUnit;

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: prices.currency_code || "INR",
    minimumFractionDigits: minorUnit,
    maximumFractionDigits: minorUnit,
  }).format(amount);
}

function getDescription(product) {
  // WooCommerce descriptions contain HTML, so render a plain-text excerpt.
  const html =
    product.short_description || product.description || "";

  if (typeof document === "undefined") {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  const element = document.createElement("div");
  element.innerHTML = html;
  return element.textContent || element.innerText || "";
}

export default function ProductBelles() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleCount, setVisibleCount] = useState(4);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Responsive number of visible products
  useEffect(() => {
    function updateVisibleCount() {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    }

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);

    return () =>
      window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // Fetch products from WooCommerce
  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Unexpected WooCommerce API response.");
        }

        setProducts(data.filter((product) => product.images?.length));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("WooCommerce product fetch error:", err);
          setError(
            "Unable to load products. Please check the WooCommerce API and CORS settings."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const { addToCart } = useCart();

  const [addingProductId, setAddingProductId] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

  //cart functionality
  async function handleAddToCart(product) {
    if (
      product.type !== "simple" ||
      product.is_purchasable === false ||
      product.is_in_stock === false
    ) {
      setCartError("Please visit the product page to select options or check availability.");
      setCartMessage("");
      return;
    }

    try {
      setAddingProductId(product.id);
      setCartMessage("");
      setCartError("");

      await addToCart(product.id, 1);

      setCartMessage(`${product.name} added to your cart.`);
    } catch (err) {
      console.error("Add to cart error:", err);
      setCartError(
        err.message || "Unable to add this product. Please try again."
      );
    } finally {
      setAddingProductId(null);
    }
  }

  // Infinite-loop slider:
  // Add copies of the first products after the real products.
  const canSlide = products.length > visibleCount;
  const loopProducts = canSlide
    ? [
      ...products,
      ...products.slice(0, visibleCount),
    ]
    : products;

  function nextSlide() {
    if (!canSlide) return;

    setIsTransitioning(true);
    setCurrentIndex((index) => index + 1);
  }

  function previousSlide() {
    if (!canSlide) return;

    if (currentIndex === 0) {
      // Jump to the matching position in the copied slides.
      setIsTransitioning(false);
      setCurrentIndex(products.length);

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(products.length - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((index) => index - 1);
    }
  }

  function handleTransitionEnd() {
    if (canSlide && currentIndex >= products.length) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  }

  // Keep the slider index valid after a responsive layout change.
  useEffect(() => {
    setCurrentIndex(0);
    setIsTransitioning(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsTransitioning(true));
    });
  }, [visibleCount]);

  return (
    <section className="w-full bg-white relative mx-auto max-w-[1440px] ">
      <div className="px-5 py-12 sm:px-8 lg:px-12 xl:px-[70px] xl:py-20">
        {/* Section title */}
        <h2 className="mb-14 text-center font-heading text-2xl md:text-3xl xl:text-5xl font-semibold uppercase tracking-wide text-[#77895D] ">
          Discover Belle&apos;s
        </h2>

        {loading && (
          <p className="py-14 text-center text-sm text-gray-500">
            Loading products...
          </p>
        )}

        {error && (
          <p
            role="alert"
            className="py-14 text-center text-sm text-red-600"
          >
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="py-12 text-center text-sm text-gray-500">
            No products with images were found.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="relative px-0 sm:px-4">
            {/* Previous navigation */}
            {canSlide && (
              <button
                type="button"
                onClick={previousSlide}
                aria-label="Previous products"
                className="absolute -left-4 cursor-pointer top-[48%] z-20 flex w-8 h-8 xl:h-14 xl:w-14 translate-y-1/3 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl leading-none text-black shadow-sm transition hover:bg-[#f5f5f0]"
              >
                <CaretLeftIcon size={20} />
              </button>
            )}

            {/* Slider viewport */}
            <div className="overflow-hidden">
              <div
                className="flex"
                style={{
                  gap: 0,
                  transform: `translateX(calc(-${currentIndex} * (100% / ${visibleCount}) - ${currentIndex * GAP / visibleCount}px))`,
                  transition: isTransitioning
                    ? "transform 450ms ease-in-out"
                    : "none",
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {loopProducts.map((product, index) => {
                  const image = product.images?.[0];
                  const rating = Math.max(
                    0,
                    Math.min(
                      5,
                      Number(product.average_rating) || 0
                    )
                  );

                  return (
                    <article
                      key={`${product.id}-${index}`}
                      className="min-w-0 shrink-0"
                      style={{
                        width: `calc((100% - ${GAP * (visibleCount - 1)
                          }px) / ${visibleCount})`,
                        marginRight: GAP,
                      }}
                    >
                      {/* Product image */}
                      <a
                        onClick={() => setSelectedProduct(product)}
                        className="block overflow-hidden cursor-pointer  rounded-md bg-[#f2f2f0]"
                        aria-label={`View ${product.name}`}
                      >
                        <div className="aspect-square w-full">
                          <img
                            src={image.src}
                            alt={image.alt || product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      </a>

                      {/* Product information */}
                      <div className="pt-6 px-4 xl:px-8  items-center">
                        <p

                          title={product.name}
                          className="block truncate font-heading text-lg xl:text-[26px] text-black"
                        >
                          {product.name}
                        </p>

                        {/* Five rating stars */}
                        <div
                          className="mt-1 flex items-center gap-0.5"
                          aria-label={`Rated ${rating} out of 5`}
                        >
                          {[1, 2, 3, 4].map((star) => (
                            <span
                              key={star}
                              className={`text-sm xl:text-2xl ${star <= Math.round(rating)
                                ? "text-gray-300"
                                : "text-black"
                                }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>

                        {/* Price */}
                        <p className="mt-1 text-base xl:text-[22px] text-black">
                          {formatPrice(product)}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(product)}
                            disabled={
                              addingProductId === product.id ||
                              product.type !== "simple" ||
                              product.is_purchasable === false ||
                              product.is_in_stock === false
                            }
                            className="rounded-full bg-[#77895D] p-4 items-center text-xs font-medium uppercase text-white transition hover:bg-[#5E432D] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {addingProductId === product.id
                              ? "Adding..."
                              : product.type !== "simple"
                                ? "Choose Options"
                                : product.is_in_stock === false
                                  ? "Out of Stock"
                                  : <ShoppingCartIcon size={20}/>}
                          </button>

                         
                          {/* Quick view */}
                        <button
                          type="button"
                          onClick={() => {
                              setSelectedProduct(product);
                              setCartMessage("");
                              setCartError("");
                            }}
                          className="group  inline-flex  cursor-pointer  max-w-fit items-center gap-3 rounded-full bg-[#77895D] py-2 xl:py-2.5 pl-4 pr-2.5 font-inter text-xs font-medium uppercase text-white  sm:gap-4 sm:pl-5 xl:text-sm transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#5E432D] hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
                        >
                          Quick View
                          <span className="flex w-6 h-6 xl:h-8 xl:w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#77895D]">
                            <ArrowUpRightIcon
                              size={16}
                              weight="bold"
                              className="transition-transform duration-300 group-hover:rotate-180"
                            />
                          </span>
                        </button>
                        </div>


                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Next navigation */}
            {canSlide && (
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next products"
                className="absolute -right-4 cursor-pointer top-[48%] z-20 flex w-8 h-8 xl:h-14 xl:w-14 translate-y-1/3 items-center justify-center rounded-full border border-gray-200 bg-white text-2xl leading-none text-black shadow-sm transition hover:bg-[#f5f5f0] "
              >
                <CaretRightIcon size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick View modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct.name}
            className="relative grid max-h-[90vh] w-full max-w-2xl gap-5 overflow-y-auto rounded-lg bg-white p-5 sm:grid-cols-2 sm:p-7"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close quick view"
              className="absolute right-3 top-2 z-10 text-2xl text-gray-600"
            >
              ×
            </button>

            <img
              src={selectedProduct.images?.[0]?.src}
              alt={
                selectedProduct.images?.[0]?.alt ||
                selectedProduct.name
              }
              className="aspect-square w-full rounded-md bg-[#f2f2f0] object-cover"
            />

            <div className="flex flex-col justify-center gap-4 pt-3">
              <h3 className="font-serif text-2xl text-[#33312d]">
                {selectedProduct.name}
              </h3>

              <p className="text-lg text-[#7A8B62]">
                {formatPrice(selectedProduct)}
              </p>

              <p className="text-sm leading-6 text-gray-600">
                {getDescription(selectedProduct)}
              </p>

              {selectedProduct.type === "simple" &&
                selectedProduct.is_purchasable !== false &&
                selectedProduct.is_in_stock !== false ? (
                <button
                  type="button"
                  onClick={() => handleAddToCart(selectedProduct)}
                  disabled={addingProductId === selectedProduct.id}
                  className="w-fit rounded-full bg-[#77895D] p-4 text-xs font-medium uppercase text-white transition hover:bg-[#5E432D] disabled:opacity-50"
                >
                  {addingProductId === selectedProduct.id
                    ? "Adding to Cart..."
                    : <ShoppingCartIcon size={20}/>}
                </button>
              ) : (
                <a
                  href={selectedProduct.permalink}
                  className="w-fit rounded-full bg-[#77895D] px-6 py-3 text-xs font-medium uppercase text-white transition hover:bg-[#5E432D]"
                >
                  {selectedProduct.type === "variable"
                    ? "Choose Options"
                    : "View Product"}
                </a>
              )}

              {cartMessage && (
                <p role="status" className="text-sm text-green-700">
                  {cartMessage}
                </p>
              )}

              {cartError && (
                <p role="alert" className="text-sm text-red-600">
                  {cartError}
                </p>
              )}

              <a
                href={selectedProduct.permalink}
                className="inline-flex w-fit rounded-full bg-[#7A8B62] px-6 py-3 text-xs uppercase text-white transition hover:bg-[#65754f]"
              >
                View Product
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
