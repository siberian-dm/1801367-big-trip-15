import PointEditFormView from '../view/point-edit-form';

import {remove, render, RenderPosition} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {isOnline} from '../utils/common';
import {toast} from '../utils/toast';
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

    this._component = new PointEditFormView(
      {
        point: Object.assign({}, NEW_POINT, {id: nanoid()}),
        isNewPoint: true,
      },
      this._model,
    );

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

    document.removeEventListener('keydown', this._escKeyDownHandler);
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
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      this._component.shake();

      return;
    }

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
