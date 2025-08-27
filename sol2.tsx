import { ReactNode } from "react";

type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (children: ReactNode) => JSX.Element;
  children: ReactNode;
};

const ConditionalWrapper: React.FC<ConditionalWrapperProps> = ({
  condition,
  wrapper,
  children,
}) => (condition ? wrapper(children) : <>{children}</>);
