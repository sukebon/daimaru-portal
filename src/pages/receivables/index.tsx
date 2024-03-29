/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Select,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { FC,  useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuthStore } from "../../../store/useAuthStore";
import { useUtils } from "@/hooks/useUtils";
import { useForm, SubmitHandler } from "react-hook-form";

type Data = {
  contents: any;
  members: number[];
  deadlines: string[];
};

type Inputs = {
  code: string;
  customer: string;
  staff: string;
  deadline: string;
  isUncollected: boolean;
};

const Receivables: FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const targetRef = useRef<any>(null);
  const [filterData, setFilterData] = useState([]);
  const [sliceData, setSliceData] = useState([]);
  const [code, setCode] = useState("");
  const [customer, setCustomer] = useState("");
  const [staff, setStaff] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isUncollected, setIsUncollected] = useState(false);
  const [isReadCheck, setIsReadCheck] = useState<boolean>(false);
  const [isloadingButton, setIsLoadingButton] = useState(false);
  const LIMIT_INIT = 500;
  const LIMIT_STEP = 500;
  const [limit, setLimit] = useState(LIMIT_INIT);
  const { getYearMonth } = useUtils();
  const { register, handleSubmit, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setCode(data.code);
    setCustomer(data.customer);
    setStaff(data.staff);
    setDeadline(data.deadline);
    setIsUncollected(data.isUncollected);
    setLimit(LIMIT_INIT);
  };

  const fetcher = async (url: string) =>
    await fetch(url, {
      headers: {
        apikey: process.env.NEXT_PUBLIC_SPREADSHEET_APIKEY as string,
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error("error fetching the data.");
      }
      return res.json();
    });
  const { data, isLoading } = useSWR<Data>("/api/receivables", fetcher);

  useEffect(() => {
    setFilterData(
      data?.contents
        .filter(
          (content: any) =>
            content.コード.includes(code) &&
            content.得意先名.includes(customer) &&
            content.担当.includes(staff) &&
            content.締日付.includes(deadline)
        )
        .filter((content: any) => {
          if (isUncollected) {
            return content.入金遅延 === "未回収";
          } else {
            return content;
          }
        })
    );
  }, [data, code, customer, staff, deadline, isUncollected]);

  useEffect(() => {
    setSliceData(filterData?.slice(0, limit));
  }, [data, filterData]);

  const addLimit = () => {
    setIsLoadingButton(true);
    setTimeout(() => {
      const newArray = [
        ...sliceData,
        ...filterData.slice(limit, limit + LIMIT_STEP),
      ];
      setSliceData(newArray);
      setLimit((prev) => prev + LIMIT_STEP);
      setIsLoadingButton(false);
    }, 500);
  };

  const filterReset = () => {
    reset();
    setCode("");
    setCustomer("");
    setStaff("");
    setDeadline("");
    setIsUncollected(false)
    setLimit(LIMIT_INIT);
    setFilterData(data?.contents);
  };

  useEffect(() => {
    const getPaymentConfirm = async () => {
      const { year, monthStr } = getYearMonth();
      const docRef = doc(db, "paymentConfirms", `${year}_${monthStr}`);
      onSnapshot(docRef, (doc: any) =>
        setIsReadCheck(doc?.data()?.checkList?.includes(currentUser))
      );
    };
    getPaymentConfirm();
  }, [currentUser]);

  const updatePaymentConfirm = async () => {
    const { year, monthStr } = getYearMonth();
    const userRef = doc(db, "authority", currentUser);
    try {
      await updateDoc(doc(db, "paymentConfirms", `${year}_${monthStr}`), {
        checkList: arrayUnion(currentUser),
        checkListRef: arrayUnion(userRef),
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading)
    return (
      <Flex w="full" justifyContent="center">
        <Spinner />
      </Flex>
    );

  return (
    <Flex direction="column" align="center">
      <TableContainer
        bg="white"
        rounded={6}
        boxShadow="md"
        p={6}
        overflowX="unset"
        overflowY="unset"
      >
        <Flex justify="space-between" align="center">
          <Box as="h1" fontSize="lg">
            売掛金回収一覧
          </Box>
          {!isReadCheck ? (
            <Button size="sm" colorScheme="blue" onClick={updatePaymentConfirm}>
              既読にする
            </Button>
          ) : (
            <Button size="sm" isDisabled={true}>
              既読
            </Button>
          )}
        </Flex>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex
            mt={6}
            gap={3}
            direction={{ base: "column", md: "row" }}
            align={{ base: "center", md: "flex-end" }}
          >
            <Box w={{ base: "full", md: "auto" }}>
              <Text fontSize="xs">コード</Text>
              <Input placeholder="コード" {...register("code")} />
            </Box>
            <Box w={{ base: "full", md: "auto" }}>
              <Text fontSize="xs">得意先名</Text>
              <Input placeholder="得意先名" {...register("customer")} />
            </Box>
            <Box w={{ base: "full", md: "auto" }}>
              <Text fontSize="xs">担当</Text>
              <Select placeholder="担当者" {...register("staff")}>
                {data?.members?.map((member) => (
                  <option key={member}>{member}</option>
                ))}
              </Select>
            </Box>
            <Box w={{ base: "full", md: "auto" }}>
              <Text fontSize="xs">締め日</Text>
              <Select placeholder="締め日" {...register("deadline")}>
                {data?.deadlines?.map((deadline) => (
                  <option key={deadline}>{deadline}</option>
                ))}
              </Select>
            </Box>
            <Box mb={2} w={{ base: "full", md: "auto" }}>
              <Checkbox checked={isUncollected} {...register("isUncollected")}>
                未回収
              </Checkbox>
            </Box>
            <Box w={{ base: "full", md: "auto" }}>
              <Flex gap={3}>
                <Button
                  type="submit"
                  colorScheme="blue"
                  w={{ base: "full", md: "auto" }}
                >
                  検索
                </Button>
                <Button w={{ base: "full", md: "auto" }} onClick={filterReset}>
                  解除
                </Button>
              </Flex>
            </Box>
          </Flex>
        </form>

        <Box
          ref={targetRef}
          mt={6}
          overflowX="auto"
          position="relative"
          h={{ base: "full", md: "calc(100vh - 300px)" }}
        >
          <Table size="sm">
            <Thead position="sticky" top={0} zIndex="docked" bg="white">
              <Tr>
                <Th>行</Th>
                <Th>コード</Th>
                <Th>得意先名</Th>
                <Th>担当</Th>
                <Th>繰越残高</Th>
                <Th>純売上額</Th>
                <Th>消費税等</Th>
                <Th>今回請求残高</Th>
                <Th>締日付</Th>
                <Th>回収予定日</Th>
                <Th>入金日付</Th>
                <Th>入金遅延</Th>
                <Th>備考</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sliceData?.map((content: any, index: number) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{content.コード}</Td>
                  <Td>{content.得意先名}</Td>
                  <Td>{content.担当}</Td>
                  <Td isNumeric>{content.繰越残高}</Td>
                  <Td isNumeric>{content.純売上額}</Td>
                  <Td isNumeric>{content.消費税等}</Td>
                  <Td isNumeric>{content.今回請求残高}</Td>
                  <Td>{content.締日付}</Td>
                  <Td>{content.回収予定日}</Td>
                  <Td>{content.入金日付}</Td>
                  <Td>{content.入金遅延}</Td>
                  <Td>{content.備考}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex justify="center">
            {sliceData?.length >= limit && (
              <Button
                isLoading={isloadingButton}
                mt={6}
                colorScheme="blue"
                onClick={addLimit}
              >
                さらに読み込む
              </Button>
            )}
          </Flex>
        </Box>
      </TableContainer>
    </Flex>
  );
};

export default Receivables;
