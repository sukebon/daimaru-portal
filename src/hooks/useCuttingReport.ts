export const useCuttingReport = () => {
  // 用尺計算
  const scaleCalc = (meter: number, totalQuantity: number) => {
    if (meter === 0 || totalQuantity === 0) return 0;
    const value = meter / totalQuantity;
    return value ? value.toFixed(2) : 0;
  };
  const getSerialNumber = (serialNumber: number) => {
    const str = "0000000000" + String(serialNumber);
    return str.slice(-10);
  };

  const withInChar = (text: string) => {
    const point = text.length >= 10 ? "..." : "";
    const str = text.slice(0, 10) + point;
    return str;
  };
  //   const getProductNumber = (productId: string) => {
  //     const result = products.find(
  //       (product: ProductType) => product.id === productId
  //     );
  //     return result?.productNumber || productId;
  //   };
  return { getSerialNumber, scaleCalc, withInChar };
};
