import React from 'react';

import './CodeBlock.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

const CodeBlock = ({ children, className, color }: Props) => (
  <pre className={`${className} CodeBlock`}>
    <code style={{ color }}>{children}</code>
  </pre>
);

export default CodeBlock;
