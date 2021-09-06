import FilterView from '../view/filter.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {UpdateType} from '../const.js';

export default class Filter {
  constructor(container, filterModel) {
    this._container = container;
    this._filterModel = filterModel;
    this._component = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const prevComponent = this._component;

    this._component = new FilterView(this._filterModel.getFilter());

    this._component.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevComponent === null) {
      render(this._container, this._component, RenderPosition.BEFOREEND);

      return;
    }

    replace(this._component, prevComponent);
    remove(prevComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MINOR, filterType);
  }
}
