export const SEARCH_FORM_METADATA = {
  searchBar: 'searchBar',
  vehicleLength: 'vehicleLength',
  mode: 'mode',
  sort: 'sort',
  fromDate: 'fromDate',
  toDate: 'toDate',
};

export enum SortMethodEnum {
  cheapest = 'cheapest',
  closest = 'closest',
}

export enum Mode {
  City = 'city',
  Airport = 'airplane',
  TruckandTrailor = 'Truck & Trailer Parking',
  Boat = 'boats',
  SemiTruck = 'Semi-Truck Parking',
  Helicopter = 'helicopter',
  Seaplane = 'seaplanes',
  //   All = 'All',
}