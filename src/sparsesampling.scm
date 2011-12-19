; Do sparse sampling into future
; model f(state,action) -> (newsate,reward)
(define argmax
  (lambda (function argument)
    1))

(define sparse-sampling
  (lambda (model state num-samples)
    (let
        ((q-star (estimate-q depth num-samples discount model state possible-actions)))
      (argmax '(estimate-Q depth num-samples model state possible-actions) action))))

(define estimate-v
  (lambda (depth num-samples discount model state possible-actions)
    (let 
        ((q-star (estimate-q depth num-samples discount model state possible-actions)))
      (max q-star))))
        
(define estimate-q
  (lambda (depth num-samples model state possible-actions)
    (cond ((equal? depth 0)
           (list 0 0 0 0 0))
          (else
           (
