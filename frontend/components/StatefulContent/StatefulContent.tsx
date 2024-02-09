import { ReactNode } from "react";
import { Loader } from "../Loader";
import { UnknownErrorMessage } from "../ErrorMessage";

interface StatefulContentProps {
    children: ReactNode;
    error: any;
    loading: boolean;
}

/**
 * Displays the correct state from given props: an error message if there is an
 * error, a loader if the content is loading and the children in other cases.
 */
const StatefulContent = ({
    children,
    error,
    loading,
}: StatefulContentProps) => {
    if (error) return <UnknownErrorMessage />;
    if (loading) return <Loader />;

    // Fragment is necessary here to have proper typing
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
};

export default StatefulContent;
