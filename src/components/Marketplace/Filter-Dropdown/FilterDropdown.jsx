import React, { useState } from "react";
import classes from "./FilterDropdown.module.css";
import Dropdown from "../../../pages/Explore/Dropdown/Dropdown";
import RadioButton from "../../../pages/Explore/Radio-Button/RadioButton";
import { ReactComponent as FilterIcon } from "../../../assets/icon-filter2.svg";

const FilterDropdown = ({ handleFilter, collection }) => {
  const [state, setState] = useState({
    toggleFilter: false,
    filter: {
      status: "not listed",
      sortby: "newest",
      minPrice: "",
      maxPrice: "",
    },
  });

  const { filter, toggleFilter } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const handleStatus = (value) => {
    handleSetState({ filter: { ...filter, status: value } });
    handleFilter({ type: "status", value });
  };

  const handleSort = (value) => {
    handleSetState({ filter: { ...filter, sortby: value } });
    handleFilter({ type: "sort", value });
  };

  const handlePriceChange = (e) => {
    let { name, value } = e.target;
    value = parseInt(value);
    handleSetState({ filter: { ...filter, [name]: value >= 0 ? value : "" } });
  };

  const handleApply = () => {
    if (filter.maxPrice < filter.minPrice) return;
    handleFilter({
      type: "range",
      value: { minPrice: filter.minPrice, maxPrice: filter.maxPrice },
    });
    handleSetState({ filter: { ...filter, minPrice: 0, maxPrice: 0 } });
  };

  const handleCancel = () => {
    handleSetState({ filter: { ...filter, minPrice: 0, maxPrice: 0 }, toggleFilter: false });
  };

  const statusFilter = ["listed", "not listed", "on auction"];
  const sortFilter = ["newest", "oldest", "highest price", "lowest price", "a - z", "z - a"];

  return (
    <div className={classes.container}>
      <div onClick={() => handleSetState({ toggleFilter: !toggleFilter })} className={classes.filterBtn}>
        <FilterIcon className={classes.filterIcon} />
        <div>Filters</div>
      </div>
      <div className={`${classes.wrapper} ${toggleFilter && classes.active}`}>
        <div className={classes.filterHeading}>
          <FilterIcon />
          <div>Filters</div>
        </div>
        {!collection && (
          <Dropdown title="Status">
            <div className={classes.dropdown}>
              {statusFilter.map((status, idx) => (
                <div key={idx} className={classes.status}>
                  <RadioButton onClick={() => handleStatus(status)} active={status === filter.status} />
                  <div>{status}</div>
                </div>
              ))}
            </div>
          </Dropdown>
        )}
        <Dropdown title="Sort by">
          <div className={classes.dropdown}>
            {sortFilter.map((sort, idx) => (
              <div key={idx} className={classes.sort}>
                <RadioButton onClick={() => handleSort(sort)} active={sort === filter.sortby} />
                <div>{sort}</div>
              </div>
            ))}
          </div>
        </Dropdown>
        <Dropdown title="Price">
          <div className={classes.priceDropdown}>
            <div className={classes.inputContainer}>
              <div className={classes.label}>Min</div>
              <input type="number" name="minPrice" min="0" value={filter.minPrice} onChange={handlePriceChange} />
            </div>
            <div>to</div>
            <div className={classes.inputContainer}>
              <div className={classes.label}>Max</div>
              <input type="number" name="maxPrice" min="0" value={filter.maxPrice} onChange={handlePriceChange} />
            </div>
          </div>
          <div className={classes.btnContainer}>
            <div onClick={handleApply} className={`${classes.btn} ${classes.apply}`}>
              Apply
            </div>
            <div onClick={handleCancel} className={`${classes.btn} ${classes.cancel}`}>
              Cancel
            </div>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default FilterDropdown;