export type ClaimProps = {
  claim: {
    customer: string;
    occurrenceDate: string;
    occurrenceSelect: string;
    occurrenceContent: string;
    amendmentSelect: string;
    amendmentContent: string;
    counterplanSelect: string;
    counterplanContent: string;
    stampStaff: string;
    status: string | number;
    operator: string;
    receptionNum: string;
    receptionDate: string;
    completionDate: string;
    imageUrl: string;
    imagePath: string;
  };
};
