import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
    width: 393px;
    padding: 8px 16px;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid rgba(41, 41, 41, 0.4);
    position: fixed;
    left: 0;
    bottom: 0;
    border-radius: 8px;
`;

// const GNBButton = styled(Link)`
//     border: none;
// `;

export default function GNB() {
    return (
        <Container>
            <Link to="/">홈</Link>
            <Link to="alarm">알람</Link>
            <Link to="profile">마이</Link>
        </Container>
    )
}