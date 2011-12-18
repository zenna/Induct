;Do following until can't continue
 ;Select a model
 ;Do sparse sampling with model
 ;Select action
 ;Transition to new state
 ;Update model

; This model:
; Assumes world only changes when I take an action

; Main routine
; state - arbitrary datastructure representing state of envionrment
; possible - actions is a list of functions which can be performed
(define do-learning
	(lambda (current-time state possible-actions)
		(cond
			(can-continue? current-time)
			(begin
				(define current-model (select-model observed-data))
				(define best-action (sparse-sampling current-model current-state))
				(define state-reward (execute-action best-action))
				((do-learning (car state-reward) (+ 1 current-time)))))))	
			
; Can the world continue
; Want to stop if world has stopped or after t-max timesteps
(define can-continue?
	(lambda (current-time state)
		(if (< current-time 10)
			#t
			#f)))

; Select a model								
(define select-model
	(lambda (observed-data)
		(model))) ;Bayesian Magic Here

; Do sparse sampling into future
(define sparse-sampling
	(lambda (model state)
		(X)))
		
; Domain Specific

; Let's roll
(do-learning 0 c)