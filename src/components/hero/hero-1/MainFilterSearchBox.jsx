import { useSelector, useDispatch } from "react-redux";
import { addCurrentTab } from "../../../features/hero/findPlaceSlice";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LocationSearch from "./LocationSearch";
import DateSearch from "../DateSearch";
import GuestSearch from "./GuestSearch";
import "../../../../public/sass/components/mainSearch.scss";

const MainFilterSearchBox = () => {
  const { currentTab } = useSelector((state) => state.hero) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tabs = [
    { name: "One Way", component: <LocationSearch /> },
    { name: "Round Trip", component: <DateSearch /> },
    { name: "Multi City", component: <GuestSearch /> },
  ];

  // Set default tab to "One Way" if currentTab is falsy or not a valid tab
  useEffect(() => {
    const validTabs = tabs.map((tab) => tab.name);
    if (!currentTab || !validTabs.includes(currentTab)) {
      dispatch(addCurrentTab("One Way"));
    }
  }, [currentTab, dispatch, tabs]);

  const handleTabSelect = (index) => {
    dispatch(addCurrentTab(tabs[index].name));
  };

  // Default to index 0 ("One Way") if currentTab is not found
  const selectedIndex = currentTab && tabs.findIndex((tab) => tab.name === currentTab) !== -1
    ? tabs.findIndex((tab) => tab.name === currentTab)
    : 0;

  // Debugging log to verify values (optional, can remove in production)
  useEffect(() => {
    console.log("Current Tab:", currentTab, "Selected Index:", selectedIndex);
  }, [currentTab, selectedIndex]);

  return (
    <div className="main-filter-search-box">
      <Tabs selectedIndex={selectedIndex} onSelect={handleTabSelect}>
        <TabList className="tabs__controls">
          {tabs.map((tab) => (
            <Tab key={tab.name} className="tabs__button" selectedClassName="is-tab-el-active">
              {tab.name}
            </Tab>
          ))}
        </TabList>

        <div className="main-search-box">
          {tabs.map((tab) => (
            <TabPanel key={tab.name} className="tabs__content">
              {tab.component}
            </TabPanel>
          ))}
          <div className="button-item">
            <button
              className="mainSearch__submit"
              // onClick={() => navigate("/flight")}
            >
              Search Flights
            </button>
          </div>
        </div>
      </Tabs>
    </div>
  );
};

export default MainFilterSearchBox;