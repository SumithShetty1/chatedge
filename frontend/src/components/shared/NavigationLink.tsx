import { Link } from "react-router-dom";

// Type definition for navigation link props
type Props = {
    to: string;
    bg: string;
    text: string;
    textColor: string;
    onClick?: () => Promise<void>;
};

// Reusable navigation link component with customizable styling
const NavigationLink = (props: Props) => {
    return (
        <Link
            onClick={props.onClick}
            className="nav-link"
            to={props.to}
            style={{ background: props.bg, color: props.textColor }}
        >
            {props.text}
        </Link>
    )
};

export default NavigationLink;
