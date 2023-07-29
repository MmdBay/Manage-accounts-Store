const countCustomer = async () => {

    const countUser = await fetch(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? 'http://127.0.0.1:2086/v1/count' : '/v1/count'}`)
    const result = await countUser.json()

    
    return result
};

export default countCustomer