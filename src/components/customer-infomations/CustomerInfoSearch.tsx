import { Box, Button, Flex, Input, Select, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { CustomerInformation } from "../../../types";

type Props = {
  customerInfoData: CustomerInformation[];
  setFilterData: Function;
};

export const CustomerInfoSearch: FC<Props> = ({
  customerInfoData,
  setFilterData,
}) => {
  const { register, reset } = useFormContext();

  return (
    <Flex
      mt={6}
      gap={3}
      align={{ base: "center", md: "flex-end" }}
      direction={{ base: "column", md: "row" }}
    >
      <Box w={{ base: "full", md: "md" }}>
        <Text>顧客名</Text>
        <Input placeholder="顧客名" {...register("customer")} />
      </Box>
      <Box w={{ base: "full", md: "md" }}>
        <Text>タイトル</Text>
        <Input placeholder="タイトル" {...register("title")} />
      </Box>
      <Box w={{ base: "full", md: "xs" }}>
        <Text>受けた印象</Text>
        <Select placeholder="受けた印象" {...register("emotion")}>
          <option value="good">Good</option>
          <option value="normal">Normal</option>
          <option value="bad">Bad</option>
        </Select>
      </Box>
      <Flex gap={3} w="full">
        <Button
          type="submit"
          w={{ base: "full", md: "auto" }}
          colorScheme="blue"
        >
          検索
        </Button>
        <Button
          w={{ base: "full", md: "auto" }}
          onClick={() => {
            reset();
            setFilterData(customerInfoData);
          }}
        >
          リセット
        </Button>
      </Flex>
    </Flex>
  );
};
