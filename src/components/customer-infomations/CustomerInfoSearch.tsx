import { Box, Button, Flex, Input, Select, Text } from "@chakra-ui/react";
import React, { FC } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import { useCustomerStore } from "../../../store/useCustomerInfoStore";

export const CustomerInfoSearch: FC = ({
}) => {
  const users = useAuthStore((state) => state.users);
  const customerInfoData = useCustomerStore((state) => state.customerInfoData);
  const filterKeyWord = useCustomerStore((state) => state.filterKeyWord);
  const setFilterCustomerInfoData = useCustomerStore(
    (state) => state.setFilterCustomerInfoData
  );
  const setFilterKeyWord = useCustomerStore((state) => state.setFilterKeyWord);

  const searchReset = () => {
    setFilterCustomerInfoData(customerInfoData);
    setFilterKeyWord({
      customer: "",
      staff: "",
      title: "",
      prefecture: "",
      emotion: "",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setFilterKeyWord({ ...filterKeyWord, [name]: value });
  };

  return (
    <Flex
      mt={6}
      gap={3}
      align={{ base: "center", md: "flex-end" }}
      direction={{ base: "column", md: "row" }}
    >
      <Box w={{ base: "full", md: "md" }}>
        <Text>顧客名</Text>
        <Input
          placeholder="顧客名"
          name="customer"
          value={filterKeyWord.customer}
          onChange={handleChange}
        />
      </Box>
      <Box w={{ base: "full", md: "md" }}>
        <Text>担当者</Text>
        <Select
          placeholder="担当者"
          name="staff"
          value={filterKeyWord.staff}
          onChange={handleChange}>
          {users
            .filter((user) => user.isoSalesStaff)
            .map((user) => (
              <option key={user.id} value={user.uid}>
                {user.name}
              </option>
            ))}
        </Select>
      </Box>
      <Box w={{ base: "full", md: "md" }}>
        <Text>タイトル</Text>
        <Input
          placeholder="タイトル"
          value={filterKeyWord.title}
          onChange={handleChange}
        />
      </Box>
      <Box w={{ base: "full", md: "xs" }}>
        <Text>受けた印象</Text>
        <Select
          placeholder="受けた印象"
          name="emotion"
          onChange={handleChange}
        >
          <option value="good">Good</option>
          <option value="normal">Normal</option>
          <option value="bad">Bad</option>
        </Select>
      </Box>
      <Flex gap={3} w="full">
        <Button
          w={{ base: "full", md: "auto" }}
          onClick={searchReset}
        >
          リセット
        </Button>
      </Flex>
    </Flex >
  );
};
