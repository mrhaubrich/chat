/* eslint-disable react/display-name */
import { Avatar, ResponsiveValue } from "@chakra-ui/react";
import { forwardRef, LegacyRef } from "react";

type UserIconProps = {
    name: string;
    size: ResponsiveValue<(string & {})>;
    src: string;
};

const UserIcon = forwardRef((props: UserIconProps, ref) => {
    return <Avatar {...props} ref={ref as LegacyRef<HTMLSpanElement>}/>;
  });

export default UserIcon;