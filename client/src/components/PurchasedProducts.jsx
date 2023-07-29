import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 10px;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  background-color: #000000c1;
  padding: 8px;
  border-radius: 4px;
  color: #fff;
  .left {
    margin-right: auto;
  }
`;

const ProductName = styled.span`
  font-size: 18px;
`;
const ProductNameR = styled.span`
  font-size: 18px;
  color: #39f048;
`;
const ProductDate = styled.span`
  font-size: 14px;
  color: goldenrod;
  background-color: #000000df;
  padding: 8px;
  border-radius: 4px;
  margin: 0 25px 0 0;
  font-weight: bold;
`;

const ProductPrice = styled.span`
  font-size: 18px;
  display: inline-block;
  margin-left: 8px;
`;

const ProductPriceR = styled.span`
  font-size: 18px;
  display: inline-block;
  margin-left: 8px;
  color: #39f048;
`;

const EditButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
  font-family: inherit;
`;

const DeleteButton = styled.button`
  background-color: #f44336;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 4px;
  font-family: inherit;
`;

const TotalPrice = styled.div`
  border-top: 1px solid gray;
  padding-top: 20px;
  font-size: 22px;
  margin: 25px auto 20px auto;
  font-weight: bold;
`;

const Error = styled.div`
  color: red;
`;

const Loading = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const EditContainer = styled.section`
  background-color: #000000d6;
  text-align: center;
  h1 {
    padding: 30px 0;
    font-size: 22px;
    color: #fff;
  }
  input {
    width: 85%;
    font-family: inherit;
    padding: 10px 12px;
    margin: 8px auto;
    outline: none;
    border: none;
    border-radius: 4px;
    border: 1px solid #55575e;
    background-color: #ffffffb3;
    backdrop-filter: blur(5px);
    color: #000000;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
    &::placeholder {
      color: #455a64;
      font-size: 12px;
    }
    &:focus {
      border: 1px solid #000000;
      background-color: #ffffff;
      &::placeholder {
        color: #000000;
      }
    }
  }
  button {
    text-align: center;
    font-family: inherit;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 1px;
    width: 70px;
    height: 40px;
    margin: 20px 8px;
    cursor: pointer;
    background-color: #ffffff;
    color: #455a64;
    border: none;
    border-radius: 4px;
    outline: none;
    transition: all 100ms cubic-bezier(0.4, 0, 0.2, 1);
    &:hover {
      background-color: #000000;
      color: #ffffff;
    }
  }
`;
const PurchasedProducts = ({ userId, refrshUsers }) => {
  const [products, setProducts] = useState([]);
  const [recived, setRecived] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editedProductName, setEditedProductName] = useState("");
  const [editedProductPrice, setEditedProductPrice] = useState("");
  const [editeRecived, setEditeRecived] = useState(null);
  const [editedRecivedPrice, setEditedRecivedPrice] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        // http://127.0.0.1:2086/
        const response = await axios.get(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/v1/purchased_products/${userId}` : `/v1/purchased_products/${userId}`}`);
        const recivedPrices = await axios.get(`${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/v1/recived_price/${userId}` : `v1/recived_price/${userId}`}`);
        setProducts(response.data);
        setRecived(recivedPrices.data);
        setError("");
      } catch (error) {
        setError("خطا در دریافت اطلاعات، لطفا دوباره تلاش کنید");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [userId, refreshKey]);

  const handleDelete = async (productId, userId, nameProduct) => {
    setLoading(true);
    try {
      // http://127.0.0.1:2086/
      await axios.delete(
        `${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/api/del/purchased_products/${productId}/${userId}/${nameProduct}` : `/api/del/purchased_products/${productId}/${userId}/${nameProduct}`}`
      );
      setProducts(products.filter((product) => product.id !== productId));
      setRefreshKey(refreshKey + 1);
      setError("");
    } catch (error) {
      setError("خطا در حذف محصول، لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
      refrshUsers();
    }
  };

  const handleDeleteRecived = async (productId, userId, nameProduct) => {
    setLoading(true);
    try {
      //http://127.0.0.1:2086/
      await axios.delete(
        `${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/api/del/recived_price/${productId}/${userId}/${nameProduct}` : `/api/del/recived_price/${productId}/${userId}/${nameProduct}`}`
      );
      setProducts(recived.filter((product) => product.id !== productId));
      setRefreshKey(refreshKey + 1);
      setError("");
    } catch (error) {
      setError("خطا در حذف محصول، لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
      refrshUsers();
    }
  };

  const handleEdit = (products) => {
    setEditingProduct(products);
    setEditedProductName(products.product_name);
    setEditedProductPrice(products.price ?? "");
  };

  const handleEditRecived = (recived) => {
    setEditeRecived(recived);
    setEditedRecivedPrice(recived.price ?? "");
  };

  const handleSave = async () => {
    if (
      editedProductName.trim() === "" ||
      !editedProductPrice ||
      editedProductPrice.toString().trim() === ""
    ) {
      setError("نام محصول و مبلغ را وارد کنید");
      return;
    }

    if (
      editedProductName.trim() === editingProduct.product_name &&
      editedProductPrice.toString().trim() ===
        (editingProduct.price ?? "").toLocaleString("fa-IR")
    ) {
      setError("هیچ تغییری اعمال نشده است");
      return;
    }

    setLoading(true);
    try {
      const editedProduct = {
        ...editingProduct,
        product_name: editedProductName.trim(),
        price: parseFloat(
          editedProductPrice.toString().trim().replace(/,/g, "")
        ),
      };
      // http://127.0.0.1:2086/
      await axios.put(
        `${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/api/edit/purchased_products/${editingProduct.id}/${editingProduct.user_id}` : `/api/edit/purchased_products/${editingProduct.id}/${editingProduct.user_id}`}`,
        editedProduct
      );

      setProducts(
        products.map((product) =>
          product.id === editingProduct.id ? editedProduct : product
        )
      );
      setEditingProduct(null);
      setEditedProductName("");
      setEditedProductPrice("");
      setError("");
    } catch (error) {
      setError("خطا در ویرایش محصول، لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
      refrshUsers();
    }
  };

  const handleSaveRcivedPrice = async () => {
    if (!editedRecivedPrice || editedRecivedPrice.toString().trim() === "") {
      setError("مبلغ دریافتی را وارد کنید");
      return;
    }

    if (
      editedRecivedPrice.toString().trim() ===
      (editeRecived.price ?? "").toLocaleString("fa-IR")
    ) {
      setError("هیچ تغییری اعمال نشده است");
      return;
    }

    setLoading(true);
    try {
      const edite = {
        ...editeRecived,
        price: parseFloat(
          editedRecivedPrice.toString().trim().replace(/,/g, "")
        ),
      };
      // http://127.0.0.1:2086/
      await axios.put(
        `${process.env.REACT_APP_NODE_ENV === 'DEV' ? `http://127.0.0.1:2086/api/edit/recived_price/${editeRecived.id}/${editeRecived.user_id}` : `/api/edit/recived_price/${editeRecived.id}/${editeRecived.user_id}`}`,
        edite
      );
        console.log(edite);
      setRecived(
        recived.map((recive) =>
          recive.id === editeRecived.id ? edite : recive
        )
      );
      setEditeRecived(null);
      setEditedRecivedPrice("");
      setError("");
      refrshUsers();
    } catch (error) {
      setError("خطا در ویرایش محصول، لطفا دوباره تلاش کنید");
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    setEditingProduct(null);
    setEditedProductName("");
    setEditedProductPrice("");
    setError("");
  };
  const handleCancelRecived = () => {
    setEditeRecived(null);
    setEditedRecivedPrice("");
    setError("");
  };

  const totalPrice = products.reduce(
    (total, product) => total + (product.price ?? 0),
    0
  );
  const totalRecived = recived.reduce(
    (total, recive) => total + (recive.price ?? 0),
    0
  );

  return (
    <>
      <Wrapper>
        {loading ? (
          <Loading>در حال بارگذاری ...</Loading>
        ) : (
          <>
            {products.length > 0 ? (
              <>
                {products.map((product) => (
                  <Product key={product.id}>
                    <ProductName>نام محصول: {product.product_name}</ProductName>
                    <ProductDate>در تاریخ: {product.created_at}</ProductDate>
                    <div className="left">
                      <ProductPrice>
                        مبلغ: {(product.price ?? 0).toLocaleString("fa-IR")}
                      </ProductPrice>
                      <EditButton onClick={() => handleEdit(product)}>
                        ویرایش
                      </EditButton>
                      <DeleteButton
                        onClick={() =>
                          handleDelete(
                            product.id,
                            product.user_id,
                            product.product_name
                          )
                        }
                      >
                        حذف
                      </DeleteButton>
                    </div>
                  </Product>
                ))}
                {recived.map((product) => (
                  <Product key={product.id}>
                    <ProductNameR>دریافتی</ProductNameR>
                    <ProductDate>در تاریخ: {product.created_at}</ProductDate>
                    <div className="left">
                      <ProductPriceR>
                        مبلغ: {(product.price ?? 0).toLocaleString("fa-IR")}
                      </ProductPriceR>
                      <EditButton onClick={() => handleEditRecived(product)}>
                        ویرایش
                      </EditButton>
                      <DeleteButton
                        onClick={() =>
                          handleDeleteRecived(product.id, product.user_id)
                        }
                      >
                        حذف
                      </DeleteButton>
                    </div>
                  </Product>
                ))}
                <TotalPrice>
                  جمع کل: {(totalPrice - totalRecived ?? 0).toLocaleString("fa-IR")} تومان
                </TotalPrice>
              </>
            ) : (
              <div>محصولی یافت نشد</div>
            )}
          </>
        )}
        {editeRecived && (
          <>
            <EditContainer>
              <h1>ویرایش مبلغ دریافتی</h1>
              <div>
                <input
                  type="text"
                  placeholder="مبلغ"
                  id="recived-price"
                  value={editedRecivedPrice}
                  onChange={(e) => setEditedRecivedPrice(e.target.value)}
                />
              </div>
              {error && <Error>{error}</Error>}
              <div>
                <button onClick={handleSaveRcivedPrice}>ذخیره</button>
                <button onClick={handleCancelRecived}>لغو</button>
              </div>
            </EditContainer>
          </>
        )}
        {editingProduct && (
          <>
            <EditContainer>
              <h1>ویرایش محصول</h1>
              <div>
                <input
                  type="text"
                  placeholder="نام محصول"
                  id="product-name"
                  value={editedProductName}
                  onChange={(e) => setEditedProductName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="قیمت"
                  id="product-price"
                  value={editedProductPrice}
                  onChange={(e) => setEditedProductPrice(e.target.value)}
                />
              </div>
              {error && <Error>{error}</Error>}
              <div>
                <button onClick={handleSave}>ذخیره</button>
                <button onClick={handleCancel}>لغو</button>
              </div>
            </EditContainer>
          </>
        )}
      </Wrapper>
    </>
  );
};

export default PurchasedProducts;
