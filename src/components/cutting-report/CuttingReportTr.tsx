import { Td, Tr } from "@chakra-ui/react";
import axios from "axios";
import { NextPage } from "next";
import React from "react";
import useSWR from "swr";
import { CuttingProduct, CuttingReport, Product } from "../../../types";
import { useCuttingReport } from "../../hooks/useCuttingReport";

type Props = {
  cuttingProduct: CuttingProduct;
  report: CuttingReport;
};

type Data = {
  content: Product;
};

export const CuttingReportTr: NextPage<Props> = ({ cuttingProduct, report }) => {
  const fetcher = (url: string) => axios.get(url).then((res) => res.data);
  const { data } = useSWR<Data>(`/api/products/${cuttingProduct.productId}`, fetcher);
  const product = data?.content;
  console.log(data);
  const { scaleCalc } = useCuttingReport();
  return (
    <Tr>
      <Td>{cuttingProduct?.category}</Td>
      <Td>{product?.productNumber}</Td>
      <Td>{product?.colorName}</Td>
      <Td>{product?.productName}</Td>
      <Td isNumeric>{cuttingProduct?.quantity}m</Td>
      <Td isNumeric>{scaleCalc(cuttingProduct?.quantity, report.totalQuantity)}m</Td>
    </Tr>
  );
};

