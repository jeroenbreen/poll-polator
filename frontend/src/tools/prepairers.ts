import {
    Election,
    Municipality,
    VoteSet,
    DeviationItem,
    DistanceList,
    Origin,
    Party,
    ElectionDistance,
    Votes,
} from "../types";

import {
    resultsToPercentage,
    getResultsForMunicipality,
    getDeviationItem,
    getDistanceingList,
} from "./relations";

export const voteSetsToRelations = (
    election: Election,
    voteSets: VoteSet[],
    municipalities: Municipality[]
): ElectionDistance => {
    const results: DistanceList[] = [];
    const deviations: DeviationItem[] = [];
    const electionNormalised = resultsToPercentage(election.results, true);
    for (const municipality of municipalities) {
        const municipalityResults = getResultsForMunicipality(
            municipality.cbs_code,
            voteSets
        );
        const municipalityNormalised = resultsToPercentage(
            municipalityResults,
            true
        );
        const municipalityDeviationItem = getDeviationItem(
            municipality.cbs_code,
            electionNormalised,
            municipalityNormalised
        );
        deviations.push(municipalityDeviationItem);
    }
    for (const municipality of municipalities) {
        const distanceList = getDistanceingList(municipality, deviations);
        results.push(distanceList);
    }

    return {
        election_id: election.id,
        distances: results,
    };
};

export const originToVotes = async (
    path: string,
    election_id: number,
    parties: Party[],
    municipalities: Municipality[]
) => {
    return new Promise(() => {
        fetch(path)
            .then((response) => response.json())
            .then((data: Origin[]) => {
                const converted = data.map((d) => {
                    let party = parties.find((p) => p.full === d.Partij);
                    const municipality = municipalities.find(
                        (m) => "G" + m.cbs_code === d.RegioCode
                    );
                    if (!party) {
                        switch (d.RegioUitslag) {
                            case "AantalBlancoStemmen":
                                party = parties.find(
                                    (p) => p.name === "Blanco"
                                );
                                break;
                            case "AantalOngeldigeStemmen":
                                party = parties.find(
                                    (p) => p.name === "Ongeldig"
                                );
                                break;
                        }
                    }
                    return {
                        election_id,
                        party_id: party ? party.id : 0,
                        votes: d.AantalStemmen,
                        municipality_code: municipality
                            ? municipality.cbs_code
                            : "",
                    };
                });
                const lines = converted.filter((c) => c.party_id !== 0);
                const result = lines.map((l) => {
                    return [
                        l.election_id,
                        l.party_id,
                        l.votes,
                        l.municipality_code,
                    ];
                });
                console.log(JSON.stringify(result));
            })
            .catch((error) => console.error("Error fetching JSON:", error));
    });
};

export const sumElection = (voteSets: VoteSet[]) => {
    const results = [];
    for (const voteSet of voteSets) {
        const index = results.findIndex((r) => r.party_id === voteSet[0]);
        if (index !== -1) {
            results[index].votes += voteSet[3];
        } else {
            results.push({
                party_id: voteSet[0],
                votes: voteSet[3],
            });
        }
    }
    return results;
};

// const count = () => {
//     //
//     const votes = store.parties.map((party) => {
//         const votes = store.votes.filter((vote) => {
//             return vote.party_id === party.id;
//         });
//         const n = votes.reduce((acc, v) => {
//             return acc + v.votes;
//         }, 0);
//         return {
//             party_id: party.id,
//             votes: n,
//         };
//     });
//     console.log(votes);
// };

export const missingVotes = (voteSets: VoteSet[]) => {
    const mLib: any = {};
    let totalVotes = 0;
    let mostVotes = 0;
    for (const voteSet of voteSets) {
        const code = voteSet[1];
        if (!mLib[code]) {
            mLib[code] = [];
        } else {
            mLib[code].push(voteSet);
        }
    }
    for (const code in mLib) {
        const m: VoteSet[] = mLib[code];
        m.sort((a, b) => {
            return b[3] - a[3];
        });
        mostVotes += m[0][3];
        for (const voteSet of m) {
            totalVotes += voteSet[3];
        }
    }
    console.log(totalVotes);
    console.log((100 * mostVotes) / totalVotes);
};

export const getSmallesOfParty = (voteSets: VoteSet[], party_id: number) => {
    const partyVotes = voteSets.filter((v) => v[2] === party_id);
    const sorted = partyVotes.sort((a, b) => {
        return a[3] - b[3];
    });
    console.log(sorted);
    return sorted[0];
};
