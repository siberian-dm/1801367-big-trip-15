import PointEditView from '../view/point-edit';

import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {nanoid} from 'nanoid';

const NEW_POINT = {
  basePrice: '',
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'taxi',
};


export default class PointNew {
  constructor(changeData, model) {
    this._changeData = changeData;
    this._model = model;

    this._component = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(container, callback) {
    this._destroyCallback = callback;

    if (this._component !== null) {
      return;
    }

    this._component = new PointEditView({point: Object.assign({}, NEW_POINT, {id: nanoid()}), isNewPoint: true}, this._model);
    this._component.setFormSubmitHandler(this._handleFormSubmit);
    this._component.setDeleteClickHandler(this._handleDeleteClick);

    render(container, this._component, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if (this._component === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._component);
    this._component = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  setSaving() {
    this._component.updateData(
      {
        update: {
          isDisabled: true,
          isSaving: true,
        },
        isUpdateNow: true,
      },
    );
  }

  setAborting() {
    const resetFormState = () => {
      this._component.updateData(
        {
          update: {
            isDisabled: false,
            isSaving: false,
            isDeleting: false,
          },
          isUpdateNow: true,
        },
      );
    };

    this._component.shake(resetFormState);
  }

  _handleFormSubmit(point) {
    delete point.id;

    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point,
    );
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  }
}
