import styled from "styled-components";

const StyledBtn = styled.button`
    width: 300px;
    height: 50px;
    padding: 10px;
    background-color: black;
    color: #fff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    transition: all 0.3s ease;

    &:hover {
        background-color: white;
        color: black;
        cursor: pointer;
        border: 1px solid black;
    }
`;

const DefaultButton:React.FC = () => {
    return <StyledBtn type="submit">Finalizar</StyledBtn>
}

export default DefaultButton