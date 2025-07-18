// src/types/types.ts

export interface Package {
  _id: string;
  package_name: string;
  package_image: string[];
  package_heading: string;
  from_country: string;
  to_country: string;
  total_price: string;
  discounted_price: string;
  duration?: string;
  country_name: string;
  region_name: string;
  continent_name: string;
  package_url: string;
}

// Airline information structure
export interface AirlineInfo {
  AirlineCode: string;
  AirlineName: string;
  FlightNumber: string;
  BookingClass: string;
  IsLowCostCarrierAirline: boolean;
}

// Airport/city details
export interface CityDetail {
  AirportCode: string;
  AirportName: string;
  CityCode: string;
  CityName: string;
  CountryCode: string;
  CountryName: string;
  StateCode: string | null;
  StateName: string | null;
  RegionCode: string | null;
  AirportTerminal: string | null;
  ID: number;
  autosuggest: string | null;
}

// Carrier information (Marketing/Operating)
export interface Carrier {
  AirlineCode: string;
  AirlineName: string;
  IsLowCostCarrierAirline: boolean;
}

// Individual flight segment details
export interface FlightDetail {
  TripIndicator: number;
  SegmentOrder: number;
  AirlineInfo: AirlineInfo;
  FromCityDetail: CityDetail;
  ToCityDetail: CityDetail;
  NoOfSeatsLeft: string;
  DepartureDate: string;
  DepartureTime: string;
  ArrivalDate: string;
  ArrivalTime: string;
  JourneyDuration: string;
  AirCraftType: string;
  LayOverDuration: string;
  CodeShareInfo: any;
  Baggage: string;
  CabinBaggage: string;
  Cabin: string;
  AvailabilityCnxType: any;
  PNRNumber: string | null;
  NumberofStops: string | null;
  MarketingCarrier: Carrier;
  OperatingCarrier: Carrier;
  FareBasis: string | null;
}

// Complete segment information, grouping multiple flights
export interface SegmentInformation {
  TripIndicator: number;
  TotalJourneyDuration: string;
  TotalNumberOfStops: string;
  TotalJourneyInMinutes: string;
  TicketingCarrier: string;
  TicketingCarrierName: string;
  FlightDetails: FlightDetail[];
  AvailString: string | null;
}

// Tax breakdown
export interface TaxDetail {
  TaxCode: string;
  TaxAmount: number;
}

// Fare breakdown for a passenger type
export interface PaxFare {
  NoOfTravellers: number;
  ptc: string;
  CurrencyCode: string;
  BasicFare: number;
  Tax: number;
  _Taxes: TaxDetail[];
  Taxes: TaxDetail[];
  Amount: number;
  ServiceFee: number;
  FareBasisCode: string | null;
}

// Complete fare information
export interface FareDetails {
  Currency: string;
  AdultCount: number;
  ChildCount: number;
  InfantCount: number;
  TotalBaseFare: number;
  TotalTax: number;
  TotalAmount: number;
  Taxes: TaxDetail[];
  PaxFares: PaxFare[];
  FareRules: string | null;
  Refundable: string;
  TotalAmountAfterRules: number;
  markupAmount: string;
  discountAmount: string;
  MarkupsApplied: any[];
}

// Overall flight itinerary
export interface FlightData {
  TraceId: string;
  ReferenceNumber: string;
  RecommendationType: string;
  FareType: string;
  Source: string;
  SegmentInformations: SegmentInformation[];
  FareDetails: FareDetails;
  airline_logos?: { [airlineName: string]: string };
  timeDuration?: {
    departureDate: string;
    departureTime: string;
    arrivalDate: string;
    arrivalTime: string;
  };
}

// The root API response structure
export interface FlightSearchResponse {
  status: boolean;
  message: string;
  data: FlightData[];
}
