import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Category from "./Category";
import styled from "styled-components";
import { getHomepageItems } from "../../store/items";
import NewItem from "./NewItem";
import PickedItem from "./PickedItem";

const HomeStyling = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;

    #home-top {
        postion: absolute;
    }

    h1 {
        text-align: center;
        font-size: 52px;
        line-height: 56px;
        font-weight: bold;
    }

    h2 {
        text-align: center;
        font-size: 44px;
        line-height: 48px;
        font-weight: bold;
    }

    #category-container {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
    }

    .section-title {
        font-size: 24px;
        font-weight: bold;
    }

    #questions {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 15px;
    }

    #contact-button {
        padding: 10px 18px;
        background-color: #faecd5;
        border-radius: 25px;
        border: 2px solid black;
        text-decoration: none;
        color: black;
        font-size: 16px;
        font-weight: bold;
        line-height: 1.5;
        transition: all 0.1s ease-in-out;
    }

    #contact-button:hover {
        transform: scale(1.01);
        filter: drop-shadow(0 3px 3px rgba(0,0,0,0.2))
    }
`

const Content = styled.div`
    width: 80%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    #breaker {
        height: 80px;
    }
`

const NewContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
`

const PickedContainer = styled.div`
    width: 100%;
    display: grid;
    margin: 0px;
    padding: 16px;
    border: 1px solid rgba(100, 100, 100, 0.3);
    border-radius: 7px;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @media (min-width: 1000px) and (max-width: 1299px) {
        grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 1300px) {
        grid-template-columns: repeat(5, 1fr);
    }

    #picks {
        margin: 20px;
        padding: 10px;
        height: auto;
        width: auto;
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;

        grid-column: 1;
        grid-row: 1;
    }

    > *:nth-child(2) {
        grid-column: 2 / 4;
        grid-row: 1 / 3;

        @media (min-width: 1000px) and (max-width: 1299px) {
            grid-column: 3 / 5;
            grid-row: 1 / 3;
        }

        @media (min-width: 1300px) {
            grid-column: 4 / 6;
            grid-row: 1 / 3;
        }
    }

    > *:nth-child(3) {
        @media (max-width: 999px) {
            grid-column: 3;
            grid-row: 3;
        }

        @media (min-width: 1000px) and (max-width: 1299px) {
            grid-column: 1 / 3;
            grid-row: 2 / 4;
        }

        @media (min-width: 1300px) {
            grid-column: 3;
            grid-row: 2;
        }
    }

    > *:nth-child(7) {
            visibility: hidden;
            height: 0px;
            width: 0px;
            grid-column: 1;
            grid-row: 1;

        @media (min-width: 1300px) {
            visibility: visible;
            height: 100%;
            width: 100%;
            grid-column: 2;
            grid-row: 2;
        }
    }
`

const AboutSection = styled.div`
    background-color: #faecd5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 80px;
    padding-top: 36px;
    padding-bottom: 36px;
    width: 100%;

    #about-text {
        font-size: 20px;
        font-weight: 300;
        line-height: 38px;
        margin: 30px;
    }
`

function HomePage() {

    const [isLoaded, setIsLoaded] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getHomepageItems()).then(() => setIsLoaded(true))
    }, [dispatch])

    const user = useSelector((state) => state.session.user)
    const items = useSelector((state) => state.items.entities.items)
    const newIds = useSelector((state) => state.items.new);
    const pickedIds = useSelector((state) => state.items.picks);

    return (
        <HomeStyling>
            <div id="home-top">
                <h1 id="header-1">{user ? `Welcome back, ${user.username}` : 'Find rare game items (temp. message)'}</h1>

                <div id="category-container">
                    <Category categoryNum="1" name="Arms" source='https://images.mapletip.com/maplestory-monsters/01302020.png' />
                    <Category categoryNum="2" name="Armor" source={false} />
                    <Category categoryNum="3" name="Accessories" source={false} />
                    <Category categoryNum="4" name="Mounts" source={false} />
                    <Category categoryNum="5" name="Consumables" source={false}/>
                </div>
            </div>


            {isLoaded &&
                <Content>
                    <div className="section-title" id="new">New!</div>
                    <NewContainer>
                        {newIds.map(id => (
                            <NewItem item={items[id]} key={`n:${id}}`}/>
                        ))}
                    </NewContainer>

                    <div id="breaker" />

                    <PickedContainer>
                        <div className="section-title" id="picks"><p>Editors' Picks</p></div>
                        {pickedIds.map((id) => (
                            <PickedItem item={items[id]} key={`p:${id}}`}/>
                        ))}
                    </PickedContainer>
                </Content>
            }

            <AboutSection>
                <h2>What is Loot Locker?</h2>
                <p id="about-text">Loot Locker is a global online marketplace, where gamers can buy and sell in-game items. (to be cont.)</p>
                <p id="questions">Have any questions?</p>
                <a href="https://github.com/justinrusso/loot-locker" id="contact-button">Contact Us</a>
            </AboutSection>
        </HomeStyling>
    )
}

export default HomePage;
