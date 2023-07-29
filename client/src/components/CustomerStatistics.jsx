import styled from 'styled-components'

const Titles = styled.p`
  font-size: 16px;
  padding: 8px 8px 16px 8px;
  border-bottom: 1px solid #000000;
`

function Title(props) {
  return (
    <>
      <Titles>{props.title}{props.icon}{props.children}</Titles>
    </>
  )
}

export default Title;