select CharacterAbilities.character_id, Abilities.name 
from Abilities
INNER JOIN CharacterAbilities on CharacterAbilities.ability_id = Abilities.id
WHERE CharacterAbilities.character_id = ?;