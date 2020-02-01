import React, { useState } from "react";

export const hhhh = () => {
  const [count, setCount] = useState(8);

  React.useEffect(() => {
    console.log(count);
  }, []);

  let r;

  return <div></div>;
};
