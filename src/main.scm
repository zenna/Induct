(load "domain.scm")
(load "helpers.scm")
(load "sparsesampling.scm")

; Select a model
; Bayesian Magic Here
(define select-model
  (lambda (observed-data state-queries)
    test-model)) 

(define execute-action
  (lambda (action)
    (cons ("state") (1.0))))

; Main algorithm for reinforcement learning
(define do-learning
  (lambda (current-time state domain possible-actions state-queries)
    (cond
      (((list-ref state-queries 0) current-time state)
       (let* ((current-model (select-model 1.0 state-queries))
              (num-samples 2)
              (depth 6)
              (discount .7)
              (best-action (sparse-sampling
                            depth num-samples
                            discount current-model
                            state possible-actions
                            state-queries))
              (new-state-reward (domain state best-action state-queries)))
         (begin
           (display current-time)
           (display new-state-reward)
           (display best-action)
           (display "\n")
           ((do-learning (+ 1 current-time)
                         (car new-state-reward)
                         domain
                         possible-actions
                         state-queries)))))
       (else
        display "Game over"))))

; Let's roll
(display "starting world\n")
(let ((size-x 20)
      (size-y 20)
      (start-pos-x 0)
      (start-pos-y 0)
      (state-queries (list can-continue? get-world-size get-agent-position))
      (possible-actions  '(move-up move-down move-left move-right)))
  (do-learning
   0
   (create-initial-state size-x size-y start-pos-x start-pos-y)
   test-model
   possible-actions
   state-queries))



