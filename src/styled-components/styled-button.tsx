import styled from "styled-components";

const StyledBtn = styled.button`
    width: 300px;
    height: 30px;
    padding: 20;
    background-color: black;

    &:hover {
        background-color: white;
        color: black;
    }
`

const DefaultButton:React.FC = () => {
    return <StyledBtn type="submit">Finalizar</StyledBtn>
}

export default DefaultButton