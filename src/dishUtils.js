/** Prix « de référence » d'un plat : le prix unique, ou le plus bas de ses variantes. */
export function basePrice(dish) {
  if (!dish) return 0;
  const vs = (dish.variants || []).map((v) => Number(v.price)).filter((n) => !isNaN(n));
  return vs.length ? Math.min(...vs) : dish.price;
}
