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
; possible-actions is a list of functions which can be performed

(load "domain.scm")
(load "sparsesampling.scm")

; Select a model								
(define select-model
	(lambda (observed-data)
		(test-model))) ;Bayesian Magic Here

; One solution is provide a function state-queries which returns functiosn which give information about state
; Problem is select-model doesnt know what actions are possible
(define do-learning
	(lambda (current-time state possible-actions state-queries)
		(cond
			((state-queries 'can-continue?) current-time state)
			(begin
				(define current-model (select-model observed-data state-queries))
				(define best-action (sparse-sampling current-model current-state))
				(define state-reward (execute-action best-action))
				((do-learning (car state-reward) (+ 1 current-time)))))))	

; Let's roll
(let ((size-x 10)
	  (size-y 10)
	  (start-pos-x 0)
	  (start-pos-y 0))
	(do-learning
		0 
		(create-initial-state size-x size-y start-pos-x start-pos-y)
		possible-actions
		state-queries))