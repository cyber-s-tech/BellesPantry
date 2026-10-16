import { useState } from "react";
import logo from "../../../assets/logo.png";
import { ArrowUpRightIcon, ShoppingCart } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../../context/CartContext";

const leftLinks = [
  { name: "HOME", href: "/" },
  { name: "ABOUT US", href: "/about" },
  { name: "SERVICES", href: "/services" },
  { name: "CONTACT US", href: "/contact" },
];

const rightLinks = [
  { name: "SHOP NOW", href: "/product" },
  { name: "FAQ", href: "/faq" },
];

export default function Header() {

  const { pathname } = useLocation();

  const isActive = (href) => pathname === href;
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const allLinks = [...leftLinks, ...rightLinks];

  const [cartOpen, setCartOpen] = useState(false);

  const {
    cart,
    itemCount,
    loading,
    error,
    removeFromCart,
    updateQuantity,
  } = useCart();


  return (
    <>
      {/* Header positioned over the hero banner */}
      <header className="absolute left-0 right-0 top-24 z-50 px-4 sm:px-8 lg:px-12 xl:px-[70px] ">
        <nav className="relative mx-auto flex h-[60px] max-w-[1440px] items-center justify-between rounded-full bg-transparent lg:bg-white px-5 lg:shadow-sm sm:h-[73px] sm:pl-[34px] sm:pr-2.5">

          {/* Desktop left navigation */}
          <div className="items-center hidden lg:flex gap-5 xl:gap-[46px]">
            {leftLinks.map((link, index) => (
              <Link
                key={link.name}
                to={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`whitespace-nowrap border-b pb-1 text-xs xl:text-base uppercase transition-colors duration-200 ${isActive(link.href)
                  ? "border-[#77895D] text-[#77895D]"
                  : "border-transparent text-[#22201d] hover:text-[#77895D]"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Center logo */}
          <div>
            <a
              href="/"
              aria-label="Belle's Pantry home"
              className="absolute left-5 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center justify-center leading-none lg:left-1/2  w-20 h-20 lg:h-[145px] lg:w-[145px] lg:-translate-x-1/2 lg:rounded-full lg:border-[5px] lg:border-white lg:bg-[#fffdf8]"
            >
              <img src={logo} alt="" />
            </a>
          </div>
          {/* Desktop right navigation */}
          <div className=" items-center hidden lg:flex gap-5 xl:gap-[46px]">
            {rightLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`whitespace-nowrap border-b pb-1 text-xs xl:text-base uppercase transition-colors duration-200 ${isActive(link.href)
                  ? "border-[#77895D] text-[#77895D]"
                  : "border-transparent text-[#22201d] hover:text-[#77895D]"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Cart button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${itemCount} items`}
              className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#77895D] transition-colors hover:bg-[#F3F6F3]"
            >
              <ShoppingCart size={24} weight="regular" />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#77895D] px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>

            <a
              href="/contact"
              className="group inline-flex ms-5 items-center gap-2 rounded-full bg-[#77895D] pl-3.5 py-3 pr-3 text-sm text-white transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#5E432D] hover:shadow-[0_10px_24px_rgba(0,0,0,0.25)]"
            >
              GET IN TOUCH
              <span className="flex w-8 h-8   items-center justify-center rounded-full bg-white text-lg leading-none text-[#77895D]">
                <ArrowUpRightIcon size={20} weight="bold"
                  className="transition-transform duration-300 group-hover:rotate-180" />
              </span>
            </a>

          </div>
          <div className="  flex ml-auto gap-4 lg:hidden">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart, ${itemCount} items`}
              className="relative h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#77895D] hover:bg-[#f5f4ef] lg:hidden"
            >
              <ShoppingCart size={23} />

              {itemCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#77895D] px-1 text-[10px] font-semibold text-white">
                  {itemCount}
                </span>
              )}
            </button>


            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex flex-col h-10 w-10  items-center justify-center gap-[5px] rounded-full hover:bg-[#f5f4ef] lg:hidden"
            >
              <span className="h-px w-5 bg-[#77895D]" />
              <span className="h-px w-5 bg-[#77895D]" />
              <span className="h-px w-5 bg-[#77895D]" />
            </button></div>

        </nav>
      </header>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={menuOpen ? 0 : -1}
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 lg:hidden ${menuOpen
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
          }`}
      />

      {/* Off-canvas drawer */}
      <aside
        id="mobile-menu"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        className={`fixed right-0 top-0 z-[70] flex h-dvh w-[min(85%,360px)] flex-col bg-[#F7F2E8] p-6 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between  pb-5">


          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-2xl hover:bg-[#ecebe3]"
          >
            ×
          </button>
        </div>

        <div className="mt-7 flex flex-col">
          {allLinks.map((link) => (

            <Link
              key={link.name}
              to={link.href}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={` className="border-b border-[#e6e3da] py-4 text-sm tracking-wide  transition-colors" ${isActive(link.href)
                ? "border-[#77895D] text-[#77895D]"
                : "border-transparent text-[#22201d] hover:text-[#77895D]"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <a
          href="/contact"
          onClick={closeMenu}
          tabIndex={menuOpen ? 0 : -1}
          className="mt-7 group mt-6 inline-flex w-fit items-center gap-3 rounded-full bg-[#77895D] py-2  pl-4 pr-2.5 font-inter text-xs font-medium uppercase text-white transition-colors duration-300 hover:bg-[#5E432D] "
        >
          GET IN TOUCH
          <span className="flex w-6 h-6 shrink-0 items-center justify-center rounded-full bg-white text-[#77895D]">
            <ArrowUpRightIcon
              size={16}
              weight="bold"
              className="transition-transform duration-300 group-hover:rotate-90"
            />
          </span>
        </a>

        <p className="mt-auto pt-8 text-[10px] tracking-widest text-[#888777]">
          SOUTHERN CULINARY ITEMS & GIFTS
        </p>
      </aside>


      {/* Cart backdrop */}
      <button
        type="button"
        aria-label="Close cart"
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-[80] bg-black/40 transition-opacity duration-300 ${cartOpen
          ? "visible opacity-100"
          : "invisible pointer-events-none opacity-0"
          }`}
      />

      {/* Cart drawer */}
      <aside
        aria-label="Shopping cart"
        aria-hidden={!cartOpen}
        className={`fixed right-0 top-0 z-[90] flex h-dvh w-[85%] max-w-[420px] flex-col bg-[#F7F2E8] shadow-2xl transition-transform duration-300 ${cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between border-b border-[#e6e3da] p-5">
          <h2 className="font-heading text-xl font-semibold text-[#22201d]">
            YOUR CART ({itemCount})
          </h2>

          <button
            type="button"
            onClick={() => setCartOpen(false)}
            aria-label="Close cart"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#ecebe3]"
          >
            X
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-[#6C6C73]">Loading your cart...</p>
          ) : error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : !cart?.items?.length ? (
            <div className="py-16 text-center">
              <ShoppingCart
                size={42}
                className="mx-auto mb-4 text-[#77895D]"
              />
              <p className="text-lg font-medium text-[#22201d]">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-[#6C6C73]">
                Discover something lovely for yourself.
              </p>

              <Link
                to="/product"
                onClick={() => setCartOpen(false)}
                className="mt-6 inline-block rounded-full bg-[#77895D] px-6 py-3 text-sm text-white hover:bg-[#5E432D]"
              >
                SHOP NOW
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {cart.items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 border-b border-[#e6e3da] pb-5"
                >
                  <img
                    src={item.images?.[0]?.thumbnail || item.images?.[0]?.src}
                    alt={item.name}
                    className="h-20 w-20 rounded-lg bg-white object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-[#22201d]">{item.name}</p>

                    <p className="mt-1 text-sm text-[#6C6C73]">
                      {item.prices?.price
                        ? `${item.prices.currency_symbol}${(
                          Number(item.prices.price) /
                          10 ** Number(item.prices.currency_minor_unit)
                        ).toFixed(Number(item.prices.currency_minor_unit))}`
                        : ""}
                    </p>


                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.key, Math.max(0, item.quantity - 1))
                        }
                        disabled={loading}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d8d5ca] disabled:opacity-50"
                      >
                        −
                      </button>

                      <span className="text-sm">{item.quantity}</span>

                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        disabled={loading}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[#d8d5ca] disabled:opacity-50"
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        disabled={loading}
                        className="ml-2 text-xs text-red-600 underline disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart?.items?.length > 0 && (
          <div className="border-t border-[#e6e3da] p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[#6C6C73]">Subtotal</span>
              <span className="font-semibold text-[#22201d]">
                {cart.totals?.currency_symbol}
                {(
                  Number(cart.totals?.total_items || 0) /
                  10 ** Number(cart.totals?.currency_minor_unit || 2)
                ).toFixed(Number(cart.totals?.currency_minor_unit || 2))}
              </span>
            </div>

            <a
              href="https://soumi.ahaanmedia.com/checkout/"
              className="block rounded-full bg-[#77895D] px-6 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-[#5E432D]"
            >
              PROCEED TO CHECKOUT
            </a>
          </div>
        )}
      </aside>

    </>
  );
}