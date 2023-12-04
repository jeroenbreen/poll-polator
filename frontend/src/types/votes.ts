import { Party, Election, Municipality } from "./index";

export interface Origin {
    RegioNaam: string;
    RegioCode: string;
    RegioUitslag: string;
    Partij: string;
    AantalStemmen: number;
    AantalZetels: string;
}

export interface VoteSet {
    party_id: number;
    election_id: number;
    municipality_code: string;
    votes: number;
}

export interface VoteSetHeavy {
    party: Party | null;
    election: Election | null;
    municipality: Municipality;
    votes: number;
}

export interface VoteResult {
    party_id: number;
    votes: number;
}

export interface VoteSetHeavyWithDistance extends VoteSetHeavy {
    distance: number;
}
