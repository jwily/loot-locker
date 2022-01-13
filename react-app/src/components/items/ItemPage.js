import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import styled from "styled-components"

import { addCartItem } from "../../store/cart-items";
import { getAnItem, deleteItem } from "../../store/items"
import { selectUser } from "../../store/session";
import { useAuthModal } from "../../context/AuthModalProvider";

const StyledItemPageDiv = styled.div`
      display: flex;
      padding-left: 10vw;
      padding-right: 10vw;
      margin-top: 4vh;

      #item-image-container {
            position: relative;
            display: flex;
            justify-content: center;
            width: 45vw;
            border: 1px solid lightgrey;
            border-radius: 8px;
            box-shadow: 2px 2px 5px grey;
      }

      #item-image {
            display: flex;
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
      }

      #edit-image-button {
            padding: 4px;
            border: 1px solid black;
            border-radius: 50%;
            position: absolute;
            right: 1vw;
            top: 2vh;
      }

      #edit-image-image {
            height: 4vh;
            padding: 5px;
      }

      #item-info-container {
            height: 100vh;
            display: flex;
            flex-direction: column;
            width: 30vw;
            padding-top: 1%;
            padding-left:2vw;


            div {
                  padding-left: 5%;
                  padding-right: 5%;
            }


            button {
                  margin-left: 5%;
                  margin-right: 5%;
            }

            span {
                  font-weight: bolder;
            }
      }

      #item-seller {
            margin-bottom: 10vh;
            font-size: x-large;
      }

      #item-name {
            display: flex;
            position: relative;
            align-items: center;
            margin-bottom: 2vh;
            font-size: xx-large;

            .edit {
                  bottom: -55px;
                  right: 2vw;
            }

            .edit-button:hover {
                  + .edit {
                        visibility: visible;
                  }
            }
      }

      #edit-icon-arrow-box-container {
            position: relative;
            // background-color: blue;
            display: flex;
            flex-direction: column;
            width: 5vw;
            height: 5vh;
            // justify-content: center;
            align-items: center;

            .edit-button {
                  margin: 0;
                  padding: 0;
            }

            .arrow_box {
                  // position: relative;
                  left: 0;

            }
      }

      #item-price {
            display: flex;
            position: relative;
            align-items: center;
            font-size: xx-large;
            font-weight: bolder;

            .is-in-stock-span {
                  font-size: large;
                  font-weight: normal;
                  position: relative;
                  left: 15vw;
            }

            .edit-button:hover {
                  + .arrow_box {
                        visibility: visible;
                  }
            }

            .arrow_box {
                  // visibility: visible
            }
      }

      #coins-icon {
            margin-right: 0.5vw
      }

      #item-stock {
            display: flex;
            align-items: center;
            margin-top: 2vh;
            font-size: xx-large;
      }

      #add-to-cart-button, #description-button, #delete-item-button {
            margin-bottom: 1vh;
            padding: 1.5vh 0;
            margin-top: 10vh;
            font-size: large;
            border: 2px solid black;
            border-radius: 30px;
      }

      #delete-item-button {
            height: 5vh;
            // overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            margin-top: 0;
            margin-bottom: 2vh;
            i {
                  color: crimson;
                  margin-right: 0.5vw;
            }
            border-radius: 30px;
            justify-content: center;
      }

      #delete-item-button:hover {
            .arrow_box {
                  visibility: visible;
            }
      }

      #dragon-icon {
            display: flex;
            height: 5vh;
            margin-right: 0.5vw;
      }

      .arrow_box {
            z-index: 2;
            display: flex;
            font-size: small;
            justify-content: center;
            align-items: center;
            width: 7vw;
            height: 4vh;
            background-color: black;
            color: #fff;
            position: absolute;
            bottom: -5.8vh;
            border-radius: 10px;
            visibility: hidden;
      }

      .arrow_box:after {
            content: " ";
            position: absolute;
            right: 2.7vw;
            top: -1vh;
            border-top: none;
            border-right: 15px solid transparent;
            border-left: 15px solid transparent;
            border-bottom: 15px solid black;
      }

      #description-button {
            display: flex;
            justify-content: space-between;
            margin-top: 1vh;
            padding-left: 10%;
            padding-right: 10%;
      }

      .edit-button {
            cursor: pointer;
            padding: 2px;
            display: flex;
            height: 5vh;
            margin-left: 0.5vw;
            position: relative;
            bottom: 2px;
      }

      #item-description {
            line-height: 2;
            margin-top: 2vh;
            overflow: hidden;
            height: 20vh;
      }
`
const StyledReviewsSectionDiv = styled.div`
      // background-color: lime;
      margin-top: 5vh;
      padding: 0 0.5vw;

      #reviews-div {
            height: 6vh;
            display: flex
      }

      #reviews-amt {
            font-size: x-large;
            display: flex;
            align-items: center;
      }

      #reviews-stars-div {
            display: flex;
            align-items: center;
            margin-left: 1vw;
      }

      .star {
            height: 50%;
            padding: 0 1px;
            display: flex;
      }
`
/**
 *
 * @param {number} stock The amount of stock remaining of the item
 */
const getCartButtonMessage = (stock) => {
      if (stock === 0) {
            return 'Out of stock'
      }

      let messageBase = 'Add to cart';

      if (stock <= 5) {
            messageBase += ` | Only ${stock} available`
      }

      return messageBase;
}

const ItemPage = () => {
      const { itemId } = useParams()
      const authModal = useAuthModal();
      const dispatch = useDispatch();
      const history = useHistory();

      useEffect(() => {
            dispatch(getAnItem(itemId))
      }, [itemId])

      const item = useSelector(state => state.items.entities.items[itemId])
      const user = useSelector(selectUser())

      const [showDescription, setShowDescription] = useState(true)

      const handleSetShowDescription = () => {
            setShowDescription(!showDescription)
      }

      const handleAddToCart = async () => {
            if (!user) {
                  authModal.show();
                  return;
            }
            await dispatch(addCartItem({
                  itemId,
                  quantity: 1
            }))
      }

      const handleDeleteItem = async () => {
            dispatch(deleteItem(itemId))
            history.push("/")
      }

      if (!item) {
            return <></>
      }

      return(
            <StyledItemPageDiv>
                  <div id="left-side-page-container">
                        <div id="item-image-container">
                              <img id="item-image" src={item.image}></img>
                              <button id="edit-image-button">
                                    <img id="edit-image-image" src="https://cdn.discordapp.com/attachments/858135958729392152/930594787944456282/bookandfeather.png"></img>
                              </button>
                        </div>
                        <StyledReviewsSectionDiv>
                              <div id="reviews-div">
                                    <span id="reviews-amt">50 shop reviews</span>
                                    <div id="reviews-stars-div">
                                          <img className="star" src="https://cdn.discordapp.com/attachments/858135958729392152/930955253296267285/star-rainbow.png"></img>
                                          <img className="star" src="https://cdn.discordapp.com/attachments/858135958729392152/930955253296267285/star-rainbow.png"></img>
                                          <img className="star" src="https://cdn.discordapp.com/attachments/858135958729392152/930955253296267285/star-rainbow.png"></img>
                                          <img className="star" src="https://cdn.discordapp.com/attachments/858135958729392152/930955253296267285/star-rainbow.png"></img>
                                          <img className="star" src="https://cdn.discordapp.com/attachments/858135958729392152/930955253296267285/star-rainbow.png"></img>
                                    </div>
                              </div>
                        </StyledReviewsSectionDiv>
                  </div>
                  <div id="item-info-container">
                        {item.userId === user.id && <button id="delete-item-button" onClick={handleDeleteItem}>
                              <img id="dragon-icon" src="https://cdn.discordapp.com/attachments/858135958729392152/930590127099613214/dragon-front.png"></img>
                              <span>Incinerate this item</span>
                              <div className="arrow_box">
                                    <span>Delete item</span>
                              </div>
                        </button>}
                        <div id="item-seller">{item.seller.username}</div>
                        <div id="item-name">
                              {item.name}
                              {item.userId === user.id && <div id="edit-icon-arrow-box-container">
                                    <img className="edit-button" src="https://cdn.discordapp.com/attachments/858135958729392152/930594787944456282/bookandfeather.png"></img>
                                    <div className="arrow_box edit">
                                          <span>Edit name</span>
                                    </div>
                              </div>}
                        </div>
                        <div id="item-price">
                              <i className="fas fa-coins" id="coins-icon"></i>
                              {item.price}
                              {item.userId === user.id && <>
                                    <img className="edit-button" src="https://cdn.discordapp.com/attachments/858135958729392152/930594787944456282/bookandfeather.png"></img>
                                    <div className="arrow_box edit">
                                          <span>Edit price</span>
                                    </div>
                              </>}

                              {item.stock > 0 && <span className="is-in-stock-span"><i className="fas fa-check"></i> In stock</span>}
                              {item.stock === 0 && <span className="is-in-stock-span"><i className="fas fa-times"></i> Out of stock</span>}
                        </div>
                        <div id="item-stock">
                              <span id="stock-span">Stock: {item.stock}</span>
                              {item.userId === user.id && <>
                                    <img className="edit-button" src="https://cdn.discordapp.com/attachments/858135958729392152/930594787944456282/bookandfeather.png"></img>
                              </>}
                        </div>
                        {user?.id !== item.seller.id && (
                              <button
                                    id="add-to-cart-button"
                                    disabled={item.stock === 0}
                                    onClick={handleAddToCart}
                              >
                                    {getCartButtonMessage(item.stock)}
                              </button>
                        )}
                        <button onClick={handleSetShowDescription}id="description-button">
                              <span>Description</span>
                              {!showDescription && <i className="fas fa-chevron-down"></i>}
                              {showDescription && <i className="fas fa-chevron-up"></i>}
                        </button>
                        {showDescription && <div id="item-description">{item.description}</div>}
                  </div>
            </StyledItemPageDiv>
      )
}

export default ItemPage
