export type Faq = {
  question: string;
  answer: string;
};

export type renderItemFunc = (item: Faq, index: number) => React.ReactElement;
