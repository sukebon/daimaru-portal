import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { db } from "../../../firebase";
import { authState } from "../../../store";

type Props = {
  docId: string;
};

const SalesEditModal: NextPage<Props> = ({ docId }) => {
  const router = useRouter();
  const currentUser = useRecoilValue(authState);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [salesObj, setSalesObj] = useState<any>();
  const [calcObj, setCalcObj] = useState<any>();

  // salesデータを取得
  useEffect(() => {
    const getSale = async () => {
      const docRef = doc(db, "sales", `${docId}`);
      const docSnap = await getDoc(docRef);
      setSalesObj({
        ...docSnap.data(),
        id: docSnap.id,
      });
    };
    getSale();
  }, [docId]);

  // リセット
  const reset = async () => {
    const getSale = async () => {
      const docRef = doc(db, "sales", `${docId}`);
      const docSnap = await getDoc(docRef);
      setSalesObj({
        ...docSnap.data(),
        id: docSnap.id,
      });
    };
    getSale();
  };

  // 売上データ更新
  const updateSales = async () => {
    const docRef = doc(db, "sales", `${docId}`);
    try {
      await updateDoc(docRef, {
        currentTarget: salesObj.currentTarget,
        currentAchieve: salesObj.currentAchieve,
        currentExpect: salesObj.currentExpect,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.log(err);
    } finally {
      router.push("/sales/");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setSalesObj({ ...salesObj, [name]: value });
  };

  const hanleCalcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setCalcObj({ ...calcObj, [name]: value });
  };

  // 基礎売上計算
  const addBaseSales = () => {
    const calcSum =
      Number(calcObj?.average) * Number(calcObj?.remain) +
      Number(calcObj?.spot);
    setSalesObj({ ...salesObj, currentExpect: calcSum });
  };

  return (
    <>
      <Button size="xs" onClick={onOpen}>
        編集
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>編集</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box fontSize="xs" textAlign="right">
              単位：万円
            </Box>
            <Stack spacing={6}>
              <Box>
                <Text>■ 予算</Text>
                <Input
                  mt={2}
                  placeholder="予算を入力してください"
                  name="currentTarget"
                  value={salesObj?.currentTarget}
                  onChange={handleInputChange}
                />
              </Box>
              <Box>
                <Text>■ 実績</Text>
                <Input
                  mt={2}
                  placeholder="実績を入力してください"
                  name="currentAchieve"
                  value={salesObj?.currentAchieve}
                  onChange={handleInputChange}
                />
              </Box>
              <Box>
                <Text>■ 計上予定</Text>
                <Input
                  mt={2}
                  placeholder="計上予定を入力してください"
                  name="currentExpect"
                  value={salesObj?.currentExpect}
                  onChange={handleInputChange}
                />
              </Box>
            </Stack>
            {/* <Stack
              mt={6}
              p={3}
              spacing={3}
              fontSize="sm"
              border="1px solid #eee"
              rounded="md"
            >
              <Box>計上予定計算</Box>

              <Box>
                <Box>日別平均売上額</Box>
                <Input
                  mt={1}
                  type="number"
                  name="average"
                  value={calcObj?.average}
                  onChange={hanleCalcChange}
                />
              </Box>
              <Box textAlign="center" fontSize="lg">
                ×
              </Box>
              <Box>
                <Box>営業残数（日）</Box>
                <Input
                  mt={1}
                  type="number"
                  name="remain"
                  value={calcObj?.remain}
                  onChange={hanleCalcChange}
                />
              </Box>
              <Box textAlign="center" fontSize="lg">
                +
              </Box>
              <Box>
                <Box>スポット案件(計上予定分)</Box>
                <Input
                  mt={1}
                  type="number"
                  name="spot"
                  value={calcObj?.spot}
                  onChange={hanleCalcChange}
                />
              </Box>
              <Box textAlign="center" fontSize="lg">
                ＝
              </Box>
              <Button onClick={addBaseSales}>計算</Button>
            </Stack> */}
          </ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              variant="ghost"
              onClick={() => {
                onClose();
                reset();
              }}
            >
              Close
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                updateSales();
                onClose();
              }}
            >
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SalesEditModal;
