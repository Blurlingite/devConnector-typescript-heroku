import React, {
  useState
} from "../../Library/Caches/typescript/3.7/node_modules/@types/react";

const [count, setCount] = useState(3);

React.useEffect(() => {
  console.log(count), [];
});
