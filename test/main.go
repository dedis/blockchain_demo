package main

import (
	"log"
)

func calcBlock(id, block, last, diff int) (hash, steps int) {
	hash = (id%10)*100 + (block%10)*10 + (last % 10)
	return calcHash(hash, diff)
}

func calcHash(hashIn, diff int) (hash, steps int) {
	hash = hashIn
	for steps = 0; steps < 10; steps++ {
		digit := ((hash % 100) + 9*(hash/10%10) + hash/100 + 2) % 10
		hash = (hash%100)*10 + digit
		if digit <= diff {
			break
		}
	}
	if steps == 10 {
		return -1, steps
	}
	return hash, steps
}

func main() {
	for diff := 2; diff >= 0; diff-- {
		log.Println("\nDifficulty is:", diff)
		for id := 0; id <= 9; id++ {
			var sum int
			var over int
			for block := 0; block < 10; block++ {
				for last := 0; last <= 4; last++ {
					_, steps := calcBlock(id, block, last, diff)
					if steps < 10 {
						sum += steps
					} else {
						over++
					}
				}
			}
			log.Printf("Id: %d - Mean: %2.2f - Unsolved: %d\n", id,
				float32(sum)/float32(30-over), over)
		}
	}
}
