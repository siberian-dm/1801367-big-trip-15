import PointView from '../view/point';
import PointEditFormView from '../view/point-edit-form';
import {replace, remove, render} from '../utils/render';
import {UserAction, UpdateType, State} from '../utils/const';
import {isDatesEqual} from '../utils/date';
import {countOffersCost, isOnline} from '../utils/common';
import {toast} from '../utils/toast';

const Mode = {
  POINT: 'POINT',
  FORM: 'FORM',
};


export default class Point {
  constructor(container, changeData, changeMode, model) {
    this._container = container;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._model = model;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.POINT;

    this._handleSwtichToForm = this._handleSwtichToForm.bind(this);
    this._handleSwitchToPoint = this._handleSwitchToPoint.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._point);
    this._pointEditComponent = new PointEditFormView({point: this._point, isNewPoint: false}, this._model);

    this._pointComponent.setSwitchToFormHandler(this._handleSwtichToForm);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setSwitchToPointHandler(this._handleSwitchToPoint);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this._container, this._pointComponent);
      return;
    }

    if (this._mode === Mode.POINT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.FORM) {
      replace(this._pointComponent, prevPointEditComponent);
      this._mode = Mode.POINT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointEditComponent);
    remove(this._pointComponent);
  }

  resetMode() {
    if (this._mode !== Mode.POINT) {
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }

  setViewState(state) {
    if (this._mode === Mode.POINT) {
      if (state === State.ABORTING) {
        this._pointComponent.shake(() => this.init(this._point));
      }

      return;
    }

    const resetFormState = () => {
      this._pointEditComponent.updateData(
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

    switch (state) {
      case State.SAVING:
        this._pointEditComponent.updateData(
          {
            update: {
              isDisabled: true,
              isSaving: true,
            },
            isUpdateNow: true,
          },
        );
        break;
      case State.DELETING:
        this._pointEditComponent.updateData(
          {
            update: {
              isDisabled: true,
              isDeleting: true,
            },
            isUpdateNow: true,
          },
        );
        break;
      case State.ABORTING:
        this._pointComponent.shake(resetFormState);
        this._pointEditComponent.shake(resetFormState);
        document.addEventListener('keydown', this._escKeyDownHandler);
        break;
    }
  }

  _replacePointToForm() {
    if (!isOnline()) {
      toast('You can\'t edit point offline');
      return;
    }

    replace(this._pointEditComponent, this._pointComponent);
    this._changeMode();
    this._mode = Mode.FORM;
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.POINT;
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleSwtichToForm() {
    this._replacePointToForm();
  }

  _handleSwitchToPoint() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      this._pointEditComponent.shake();

      return;
    }

    const isMinorChange = !isDatesEqual(this._point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this._point.dateTo, update.dateTo) ||
      this._point.basePrice !== update.basePrice ||
      countOffersCost(this._point.offers) !== countOffersCost(update.offers);

    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorChange ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleDeleteClick() {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      this._pointEditComponent.shake();

      return;
    }

    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      this._point,
    );

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    const point = Object.assign({}, this._point, {isFavorite: !this._point.isFavorite});

    this._changeData(UserAction.UPDATE_POINT, UpdateType.PATCH, point);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
    }
  }
}
