; This model:
; Assumes world only changes when I take an action

; Main routine
; state - arbitrary datastructure representing state of envionrment
; possible-actions is a list of functions which can be performed

(load "domain.scm")
(load "helpers.scm")
(load "sparsesampling.scm")

; Select a model
; State-queries should give us a list of possible queries we can perform on environment		
(define select-model
  (lambda (observed-data state-queries)
    test-model)) ;Bayesian Magic Here

; One solution is provide a function state-queries which returns functions which give information about state
; can call these by name
; Or we could provide a list of functions, but then we cant reference them ( do we need to?)
; Problem is select-model doesnt know what actions are possible

; The goal here is 1. To have select-model has some access to a finite number of functions which it can call
; I need to be able to query teh state, 
; If i make state-queries a list of functions that operate on state
; 
(define do-learning
  (lambda (current-time state possible-actions state-queries)
    (cond
      (((list-ref state-queries 0) current-time state)
       (let* ((current-model (select-model 1.0 state-queries))
              (num-samples 3)
              (depth 3)
              (discount .7)
              (best-action (sparse-sampling
                            depth num-samples
                            discount current-model
                            state possible-actions
                            state-queries)))
         (begin
           (display current-time)
           (display "\n")
           (display best-action)
           ((do-learning (+ 1 current-time) state
                         possible-actions
                         state-queries)))))
       (else
        (display "Game over")))))

;(best-action (sparse-sampling current-model state))
;(state-reward (execute-action best-action)))

(define execute-action
  (lambda (action)
    (cons ("state") (1.0))))

; Let's roll
(display "starting world\n")
(let ((size-x 10)
      (size-y 10)
      (start-pos-x 2)
      (start-pos-y 2)
      (state-queries (list can-continue? get-world-size get-agent-position))
      (possible-actions  '(move-up move-down move-left move-right)))
  (do-learning
   0
   (create-initial-state size-x size-y start-pos-x start-pos-y)
   possible-actions
   state-queries))



